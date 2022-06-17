import "dotenv/config";
import "./db";
import "./models/Room";
import "./models/User";
import "./models/Review";
import app from "./server";

const PORT = 4000;

const handleListening = () =>
  console.log(`✅ Server Listening on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
