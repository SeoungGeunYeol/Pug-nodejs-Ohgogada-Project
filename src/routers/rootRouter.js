import express from "express";
import {
  getLogin,
  getSignup,
  postLogin,
  postSignup,
} from "../controllers/userController";
import { home, search } from "../controllers/roomController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/signup").get(getSignup).post(postSignup);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/search", search);

export default rootRouter;
