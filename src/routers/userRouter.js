import express from "express";
import {
  edit,
  remove,
  logout,
  detail,
  getGithubLogin,
  postGithubLogin,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/remove", remove);
userRouter.get("/github/start", getGithubLogin);
userRouter.get("/github/finish", postGithubLogin);
userRouter.get("/:id", detail);

export default userRouter;
