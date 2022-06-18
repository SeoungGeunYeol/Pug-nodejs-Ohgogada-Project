import express from "express";
import { createReview } from "../controllers/roomController";

const apiRouter = express.Router();

apiRouter.post("/rooms/:id([0-9a-f]{24})/review", createReview);

export default apiRouter;
