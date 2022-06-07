export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "🚀오고가다";
  res.locals.loggedInUser = req.session.user;
  next();
};
