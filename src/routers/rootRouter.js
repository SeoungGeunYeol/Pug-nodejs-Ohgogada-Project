import express from "express";
import {
  badlogout,
  getLogin,
  getSignup,
  postLogin,
  postSignup,
} from "../controllers/userController";
import { home, search } from "../controllers/roomController";
import { publicOnlyMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter
  .route("/signup")
  .all(publicOnlyMiddleware)
  .get(getSignup)
  .post(postSignup);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.get("/search", search);
rootRouter.get("/logout", badlogout);

export default rootRouter;
