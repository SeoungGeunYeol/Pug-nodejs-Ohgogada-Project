import express from "express";
import {
  deleteRoom,
  detail,
  getEdit,
  getUpload,
  postEdit,
  postUpload,
} from "../controllers/roomController";
import { protectorMiddleware, roomPhotoUpload } from "../middlewares";

const roomRouter = express.Router();

roomRouter.get("/:id([0-9a-f]{24})", detail);
roomRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
roomRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectorMiddleware)
  .get(deleteRoom);
roomRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(roomPhotoUpload.single("photo"), postUpload);

export default roomRouter;
