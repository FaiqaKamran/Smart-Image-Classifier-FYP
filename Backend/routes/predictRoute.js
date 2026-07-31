import express from "express";
import multer from "multer";

import {
  predictImage,
  getAllResults
} from "../controllers/predictController.js";

const router = express.Router();

const upload = multer();

router.post(
  "/predict",
  upload.single("image"),
  predictImage
);

router.get("/results", getAllResults);

export default router;