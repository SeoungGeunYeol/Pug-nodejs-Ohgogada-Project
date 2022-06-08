import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

const HTTP_BAD_REQUEST = 400;

// ◼ globalRouter ◼
// ** Sign Up **
// getSignup
export const getSignup = (req, res) => {
  return res.render("users/signup", { pageTitle: "Sign Up" });
};
// postSignup
export const postSignup = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;
  const pageTitle = "Sign Up";
  if (password !== password2) {
    return res.status(HTTP_BAD_REQUEST).render("users/signup", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(HTTP_BAD_REQUEST).render("users/signup", {
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
    return res.render("users/signup", {
      pageTitle: "Upload Room",
      errorMessage: error._message,
    });
  }
};

// ** LogIn **
// getLogin
export const getLogin = (req, res) => {
  return res.render("users/login", { pageTitle: "Log In" });
};
// postLogin
export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const pageTitle = "Log In";
  const user = await User.findOne({ email, socialOnly: false });
  // check if account exists
  if (!user) {
    return res.status(HTTP_BAD_REQUEST).render("users/login", {
      pageTitle,
      errorMessage: "An account with this email does not exists",
    });
  }
  // check if paswword correct
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(HTTP_BAD_REQUEST).render("users/login", {
      pageTitle,
      errorMessage: "Wrong Password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

// ◼ userRouter ◼
// ** GithubLogin **
// startGithubLogin (memo.txt 참조)
export const startGithubLogin = (req, res) => {
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
// finishGithubLogin
export const finishGithubLogin = async (req, res) => {
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

// ** logOut **
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

// ** Edit **
// getEdit
export const getEdit = (req, res) => {
  return res.render("users/editUser", { pageTitle: "Edit Profile" });
};
// postEdit
export const postEdit = async (req, res) => {
  const pageTitle = "Edit Profile";
  const {
    session: {
      user: { _id },
    },
    body: { name, email, username, location },
  } = req;

  if (req.session.user.email !== email) {
    const exists = await User.exists({ email });
    if (exists) {
      return res.status(HTTP_BAD_REQUEST).render("users/editUser", {
        pageTitle,
        errorMessageEmail: "This email is aleady taken",
      });
    }
  }

  if (req.session.user.username !== username) {
    const exists = await User.exists({ username });
    if (exists) {
      return res.status(HTTP_BAD_REQUEST).render("users/editUser", {
        pageTitle,
        errorMessageUsername: "This username is aleady taken",
      });
    }
  }

  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updateUser;
  return res.redirect("edit");
};
// ** Change Password **
// getChangePassword
export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};
// postChangePassword
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPassword2 },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(HTTP_BAD_REQUEST).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect.",
    });
  }
  if (newPassword !== newPassword2) {
    return res.status(HTTP_BAD_REQUEST).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "New password does not match the comfirmation.",
    });
  }
  user.password = newPassword;
  await user.save();
  return res.redirect("/users/edit");
};

export const remove = (req, res) => res.send("Remove User");

export const detail = (req, res) => res.send("Detail User");
