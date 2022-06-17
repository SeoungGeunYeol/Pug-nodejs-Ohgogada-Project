import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "🚀오고가다";
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

// multer() : 이미지, 동영상 등을 비롯한 여러 가지 파일들을
// 멀티파트 형식으로 업로드할 때 사용하는 미들웨어이다.
export const avatarUpload = multer({ dest: "uploads/avatars/" });

export const roomPhotoUpload = multer({ dest: "uploads/photos/" });
