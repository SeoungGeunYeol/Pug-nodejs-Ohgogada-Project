import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

// ** globalRouter **
export const getSignup = (req, res) =>
  res.render("signup", { pageTitle: "Sign Up" });
export const postSignup = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;
  const pageTitle = "Sign Up";
  if (password !== password2) {
    return res.status(400).render("signup", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("signup", {
      pageTitle,
      errorMessage: "This username/email is already taken.",
    });
  }
  try {
    await User.create({
      name,
      email,
      username,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.render("signup", {
      pageTitle: "Upload Room",
      errorMessage: error._message,
    });
  }
};
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log In" });

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const pageTitle = "Log In";
  const user = await User.findOne({ email, socialOnly: false });
  // check if account exists
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this email does not exists",
    });
  }
  // check if paswword correct
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong Password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  res.redirect("/");
};

// ** userRouter **
// getGithubLogin (memo.txt 참조)
export const getGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENTID,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

/*
fetch()  함수
-- HTTP 요청 전송 기능을 제공하는 Wen API이다.(JS내장 라이브러리)
-- Server와 비동기 요청 방식을 기능한다.
-- 
1. fetch('url')로 다른 서버를 통해 데이터를 가져올 수 있다.
but res.body 에 담겨있는 url은 제대로 된 객체를 받아올 수 없다.
2. json함수가 res의 스트림을 가져와 끝까지 읽고, res.body의 텍스트를 promise형태로
반환한다.
3. 다른 서버의 데이터를 object형식으로 받아온다.
*/

export const postGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENTID,
    client_secret: process.env.GH_CLIENTID_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    // access api
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    // create user
    if (!user) {
      user = await User.create({
        name: userData.name,
        avatarUrl: userData.avatar_url,
        email: emailObj.email,
        username: userData.login,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

// log Out session.destroy()
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const detail = (req, res) => res.send("Detail User");
