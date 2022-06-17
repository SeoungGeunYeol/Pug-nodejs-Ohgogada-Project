import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 30 },
  fileUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minlength: 10 },
  city: { type: String, required: true, trim: true },
  price: { type: Number, required: true, trim: true },
  amenities: [{ type: String, trim: true }],
  createdAt: { type: Date, default: Date.now },
  reviews: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Review" },
  ],
  host: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

roomSchema.static("formatAmenities", function (amenities) {
  return amenities
    .split(",")
    .map((word) =>
      word.trim().startsWith("#") ? word.trim() : `#${word.trim()}`
    );
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
