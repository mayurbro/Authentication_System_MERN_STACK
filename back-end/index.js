import express from "express";
const app = express();
import { connectDB } from "./db/connectDb.js";
import dotenv from "dotenv";
import path from "path";
// import { fileURLToPath } from "url";
import { User } from "./models/user.model.js";
import cors from "cors";
dotenv.config();
import cookieParser from "cookie-parser";

import authRoutes from "./Routes/auth_route.js";

app.use(express.json());
// parsing cookies
app.use(cookieParser());
console.log("hello");

const PORT = process.env.PORT || 4000;
// const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve();
app.use(cors({ origin: "http://localhost:5174", credentials: true }));

//comman path for all the routes
app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/front-end/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "front-end", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port: ", PORT);
});
