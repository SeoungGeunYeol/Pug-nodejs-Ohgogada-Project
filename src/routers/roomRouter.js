import express from "express";
import {
  deleteRoom,
  detail,
  getEdit,
  getUpload,
  postEdit,
  postUpload,
} from "../controllers/roomController";

const roomRouter = express.Router();

roomRouter.get("/:id([0-9a-f]{24})", detail);
roomRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
roomRouter.route("/:id([0-9a-f]{24})/delete").get(deleteRoom);
roomRouter.route("/upload").get(getUpload).post(postUpload);

export default roomRouter;
