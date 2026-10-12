from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import cv2
import numpy as np
from PIL import Image
import io
import os
import traceback

app = Flask(__name__)
CORS(app)

# MODEL LOAD
print(" Loading model...")
model_path = "best.pt"

if not os.path.exists(model_path):
    print(f" Model not found: {model_path}")
    exit(1)

try:
    from ultralytics import YOLO
    model = YOLO(model_path)
    print(" Model loaded successfully!")
    print(f" Model classes: {model.names}")
    
    test_img = np.zeros((480, 480, 3), dtype=np.uint8)
    test_result = model(test_img)
    print(" Model test prediction successful!")
    
except Exception as e:
    print(f" Model load failed: {e}")
    traceback.print_exc()
    exit(1)

#  GLOBAL CLASS NAMES
CLASS_NAMES = {
    0: "Cotton Bacterial Blight",
    1: "Cotton Healthy",
    2: "Rice Brown Spot",
    3: "Rice Healthy",
    4: "Wheat Healthy",
    5: "Wheat Rust"
}

#  CROP-WISE DISEASE NAMES (Override ke liye)
CROP_DISEASE_MAP = {
    "rice": {
        "disease": "Rice Brown Spot",
        "healthy": "Rice Healthy"
    },
    "cotton": {
        "disease": "Cotton Bacterial Blight",
        "healthy": "Cotton Healthy"
    },
    "wheat": {
        "disease": "Wheat Rust",
        "healthy": "Wheat Healthy"
    }
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        crop_type = request.form.get("cropType", "").lower().strip()
        print(f"\n Crop Type: '{crop_type}'")
        
        if 'image' not in request.files:
            return jsonify({'error': 'No image uploaded'}), 400
        
        file = request.files['image']
        print(f" File: {file.filename}")
        
        # Read image
        img_bytes = file.read()
        img_array = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        
        if img is None:
            file.seek(0)
            img = Image.open(io.BytesIO(file.read()))
            img = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        
        if img is None:
            return jsonify({'error': 'Invalid image'}), 400
        
        print(f" Image shape: {img.shape}")
        
        # Predict
        results = model(img)
        print(" Prediction complete!")
        
        #  Process detections
        detections = []
        for r in results:
            boxes = r.boxes
            if boxes is not None:
                for box in boxes:
                    cls = int(box.cls[0])
                    conf = float(box.conf[0])
                    
                    class_name = CLASS_NAMES.get(cls, f"Class_{cls}")
                    
                    print(f"  Class {cls} → {class_name} ({conf:.2%})")
                    
                    detections.append({
                        'class': class_name,
                        'confidence': round(conf * 100, 2),
                        'class_id': cls
                    })
        
        if detections:
            best = max(detections, key=lambda x: x['confidence'])
            disease = best['class']
            
            #  CROP-WISE OVERRIDE
            if crop_type in CROP_DISEASE_MAP:
                crop_map = CROP_DISEASE_MAP[crop_type]
                
                # Healthy check
                if "healthy" in disease.lower():
                    disease = crop_map["healthy"]
                else:
                    # Agar disease ka naam crop se match nahi karta, toh override karein
                    if crop_type not in disease.lower():
                        disease = crop_map["disease"]
                
                print(f"  Override → {disease}")
            
            return jsonify({
                'success': True,
                'disease': disease,
                'confidence': best['confidence'],
                'treatment': get_treatment(disease),
                'detections': detections
            })
        else:
            default = f"{crop_type.title()} Healthy" if crop_type else "Healthy"
            return jsonify({
                'success': True,
                'disease': default,
                'confidence': 95.0,
                'treatment': 'No treatment needed',
                'detections': []
            })
        
    except Exception as e:
        print(f" Error: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500

def get_treatment(disease_name):
    treatments = {
        "Cotton Bacterial Blight": "Apply copper-based fungicide. Remove infected plants.",
        "Cotton Healthy": "No treatment needed. Continue regular care.",
        "Rice Brown Spot": "Apply Mancozeb fungicide. Improve field drainage.",
        "Rice Healthy": "No treatment needed. Continue regular care.",
        "Wheat Healthy": "No treatment needed. Continue regular care.",
        "Wheat Rust": "Apply Tebuconazole fungicide. Practice crop rotation."
    }
    return treatments.get(disease_name, "Consult agricultural expert.")

if __name__ == '__main__':
    print("\n" + "="*50)
    print(" Starting Crop Disease Detection API")
    print("="*50)
    print(f" Server: http://localhost:5000")
    print("="*50 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5000)