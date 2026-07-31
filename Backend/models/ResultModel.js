import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    cropType: {
      type: String,
      required: true
    },
    disease: {
      type: String,
      required: true
    },
    confidence: {
      type: Number, 
      required: true
    },
    treatment: {
      type: String,
      required: true
    },
    detections: {
      type: Array,
      default: []
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Result", resultSchema);