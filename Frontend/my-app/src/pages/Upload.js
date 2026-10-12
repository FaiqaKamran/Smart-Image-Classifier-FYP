import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiUpload, FiCheckCircle, FiAlertTriangle, 
  FiBarChart2, FiArrowUp, FiX, FiSend 
} from "react-icons/fi";

//  Image compress function
const compressImage = (file, callback) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    const img = new Image();
    img.src = reader.result;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_SIZE = 250;
      
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > MAX_SIZE) {
          height = (height * MAX_SIZE) / width;
          width = MAX_SIZE;
        }
      } else {
        if (height > MAX_SIZE) {
          width = (width * MAX_SIZE) / height;
          height = MAX_SIZE;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
      callback(compressedBase64);
    };
  };
  reader.readAsDataURL(file);
};

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cropType, setCropType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    } else {
      alert("Please select a valid image file");
    }
  };

  const handleAnalyze = async () => {
    if (!file || !cropType) {
      alert("Please select an image and crop type first!");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("cropType", cropType);

      const response = await fetch("http://localhost:5001/api/predict/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const prediction = data.prediction;
        
        const isHealthy = prediction.disease && prediction.disease.toLowerCase().includes('healthy');
        
        const analysisResult = {
          status: isHealthy ? "Healthy" : "Disease Detected",
          confidence: prediction.confidence || 0,
          disease: prediction.disease || "No disease detected",
          severity: prediction.confidence > 80 ? "Low" : prediction.confidence > 50 ? "Medium" : "High",
          message: prediction.treatment || "Consult agricultural expert",
          recommendations: [
            "Maintain regular monitoring",
            "Follow recommended treatment",
            "Consult local agricultural expert"
          ]
        };

        //  Image compress karke save karein
        compressImage(file, (compressedBase64) => {
          const newUpload = {
            id: Date.now(),
            crop: cropType,
            status: analysisResult.status,
            confidence: `${analysisResult.confidence}%`,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            reviewed: false,
            disease: analysisResult.disease,
            severity: analysisResult.severity,
            message: analysisResult.message,
            image: compressedBase64
          };

          try {
            const savedUploads = localStorage.getItem('cropUploads');
            let allUploads = savedUploads ? JSON.parse(savedUploads) : [];
            
            allUploads.unshift(newUpload);
            if (allUploads.length > 5) {
              allUploads = allUploads.slice(0, 5);
            }
            
            localStorage.setItem('cropUploads', JSON.stringify(allUploads));
            window.dispatchEvent(new Event('newUploadAdded'));
            
            setResult(analysisResult);
          } catch (error) {
            console.error("Storage error:", error);
            // Storage full 
            localStorage.removeItem('cropUploads');
            localStorage.setItem('cropUploads', JSON.stringify([newUpload]));
            setResult(analysisResult);
          }
          
          setUploading(false);
        });
        
      } else {
        alert("Prediction failed: " + (data.error || "Unknown error"));
        setUploading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again.");
      setUploading(false);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setFile(null);
    setResult(null);
  };

  return (
    <div className="upload-page">
      <div className="container">
        <div className="upload-header">
          <span className="page-badge">AI Analysis</span>
          <h1>Crop Disease Detection</h1>
          <p>Upload a clear image of your crop leaf for instant AI-powered analysis</p>
        </div>

        <div className="upload-grid">
          <div className="upload-panel">
            <div className="panel-card">
              <div className="form-group">
                <label className="form-label">
                  <FiBarChart2 /> Select Crop Type
                </label>
                <select 
                  value={cropType} 
                  onChange={(e) => setCropType(e.target.value)}
                  className="form-select"
                >
                  <option value="">Choose Crop</option>
                  <option value="Rice">Rice</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Wheat">Wheat</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FiUpload /> Upload Image
                </label>
                <div className="upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    id="file-input"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="file-input" className="upload-label">
                    <div className="upload-icon"></div>
                    <p>Click or drag to upload</p>
                    <span>JPG, PNG (Max 10MB)</span>
                  </label>
                </div>
              </div>

              {preview && (
                <div className="preview-card">
                  <div className="preview-header">
                    <h4>Preview</h4>
                    <button className="icon-btn" onClick={clearImage}>
                      <FiX />
                    </button>
                  </div>
                  <img src={preview} alt="Preview" className="preview-image" />
                  <div className="preview-info">
                    <span>{file?.name}</span>
                    <span>{(file?.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
              )}

              <button 
                className={`analyze-btn ${(!file || !cropType || uploading) ? 'disabled' : ''}`}
                onClick={handleAnalyze}
                disabled={!file || !cropType || uploading}
              >
                {uploading ? (
                  <>
                    <div className="spinner"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FiCheckCircle /> Analyze Image
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="results-panel">
            {result ? (
              <div className="results-card">
                <div className="results-header">
                  <FiCheckCircle className="success-icon" />
                  <h3>Analysis Complete</h3>
                </div>

                <div className={`status-badge ${result.status === "Healthy" ? "healthy" : "warning"}`}>
                  {result.status === "Healthy" ? "Healthy Crop" : "Disease Detected"}
                </div>

                <div className="results-details">
                  <div className="detail-item">
                    <label>Crop Type</label>
                    <p>{cropType}</p>
                  </div>
                  <div className="detail-item">
                    <label>Confidence</label>
                    <p className="confidence">{result.confidence}%</p>
                  </div>
                  <div className="detail-item">
                    <label>Disease</label>
                    <p>{result.disease}</p>
                  </div>
                  <div className="detail-item">
                    <label>Severity</label>
                    <p>{result.severity}</p>
                  </div>
                </div>

                <div className="recommendation-box">
                  <h4><FiAlertTriangle /> Recommendation</h4>
                  <p>{result.message}</p>
                </div>

                <div className="actions-list">
                  <h4>Suggested Actions</h4>
                  <ul>
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx}>
                        <span className="check">✓</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="consult-btn">
                  <FiSend /> Consult Expert
                </button>
              </div>
            ) : (
              <div className="empty-results">
                <div className="empty-icon"></div>
                <h3>Ready for Analysis</h3>
                <p>Upload an image and select crop type to see results</p>
                <div className="tips-box">
                  <h4>Pro Tips</h4>
                  <ul>
                    <li>Use clear, well-lit images</li>
                    <li>Focus on the affected area</li>
                    <li>Ensure good contrast</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <button 
        className={`scroll-top-btn ${showScrollTop ? 'show' : ''}`} 
        onClick={scrollToTop}
      >
        ↑
      </button>
    </div>
  );
}