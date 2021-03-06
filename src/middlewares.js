import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "πμ€κ³ κ°λ€";
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Log in first.");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

// multer() : μ΄λ―Έμ§, λμμ λ±μ λΉλ‘―ν μ¬λ¬ κ°μ§ νμΌλ€μ
// λ©ν°ννΈ νμμΌλ‘ μλ‘λν  λ μ¬μ©νλ λ―Έλ€μ¨μ΄μ΄λ€.
export const avatarUpload = multer({ dest: "uploads/avatars/" });

export const roomPhotoUpload = multer({ dest: "uploads/photos/" });
