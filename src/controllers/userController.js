import User from "../models/User";
import bcrypt from "bcrypt";

// globalRouter
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
  const user = await User.findOne({ email });
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

// userRouter
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const detail = (req, res) => res.send("Detail User");
