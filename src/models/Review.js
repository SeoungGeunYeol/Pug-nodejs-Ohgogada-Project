import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  text: { type: String, required: true },
  host: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  room: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Room" },
  createdAt: { type: Date, required: true, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
