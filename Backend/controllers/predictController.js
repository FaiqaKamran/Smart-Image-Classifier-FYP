import axios from "axios";
import FormData from "form-data";
import Result from "../models/ResultModel.js";

export const predictImage = async (req, res) => {
  try {
    const { cropType } = req.body;
    const formData = new FormData();
    formData.append("image", req.file.buffer, req.file.originalname);

    //  CALL FLASK APP
    const response = await axios.post(
      "http://localhost:5000/predict",  
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 30000 
      }
    );

    console.log(" Flask response:", response.data);

    if (response.data.success) {
      const savedResult = await Result.create({
        cropType,
        disease: response.data.disease || "Unknown",
        confidence: response.data.confidence || "0%",
        treatment: response.data.treatment || "Consult expert",
        detections: response.data.detections || []
      });

      res.status(200).json({
        success: true,
        result: savedResult,
        prediction: response.data
      });
    } else {
      res.status(500).json({
        success: false,
        error: response.data.error || "Prediction failed"
      });
    }

  } catch (err) {
    console.error(" Prediction error:", err.message);
    if (err.response) {
      console.error("Response data:", err.response.data);
    }
    res.status(500).json({
      success: false,
      error: "Prediction failed: " + err.message
    });
  }
};

// GET ALL RESULTS FOR DASHBOARD
export const getAllResults = async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};