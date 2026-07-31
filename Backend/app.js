import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import predictRoute from "./routes/predictRoute.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/predict", predictRoute);

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

app.listen(5001, () => {
  console.log("Server running on port 5001");
});