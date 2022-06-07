import express from "express";
import {
  remove,
  detail,
  getGithubLogin,
  postGithubLogin,
  getEdit,
  postEdit,
  logout,
} from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get("/remove", remove);
userRouter.get("/github/start", publicOnlyMiddleware, getGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, postGithubLogin);
userRouter.get("/:id", detail);

export default userRouter;
