import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const handleOpen = () => console.log("✅ MongoDB connected!");
const handelError = (error) => console.log("❎DB Error", error);

db.on("error", handelError);
db.once("open", handleOpen);
