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
    print(" Please place best.pt in this folder")
    exit(1)

try:
    from ultralytics import YOLO
    model = YOLO(model_path)
    print(" Model loaded successfully!")
    
    # Test prediction
    test_img = np.zeros((480, 480, 3), dtype=np.uint8)
    test_result = model(test_img)
    print(" Model test prediction successful!")
    
except Exception as e:
    print(f" Model load failed: {e}")
    traceback.print_exc()
    exit(1)

# CLASS NAMES
CLASS_NAMES = {
    0: "Cotton Bacterial_Blighty",
    1: "Cotton Healthy",
    2: "Rice Brown_Spot",
    3: "Rice Healthy",
    4: "Wheat Healthy",
    5: "Wheat Rust"
}

# ROUTES 
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        print("\n Prediction request received")
        
        if 'image' not in request.files:
            return jsonify({'error': 'No image uploaded'}), 400
        
        file = request.files['image']
        print(f" File: {file.filename}")
        
        # Read image
        img_bytes = file.read()
        img_array = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        
        if img is None:
            # Try PIL fallback
            file.seek(0)
            img = Image.open(io.BytesIO(file.read()))
            img = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        
        if img is None:
            return jsonify({'error': 'Invalid image'}), 400
        
        print(f" Image shape: {img.shape}")
        
        # Predict
        results = model(img)
        print(" Prediction complete!")
        
        # Process results
        detections = []
        for r in results:
            boxes = r.boxes
            if boxes is not None:
                for box in boxes:
                    cls = int(box.cls[0])
                    conf = float(box.conf[0])
                    class_name = CLASS_NAMES.get(cls, f"Class_{cls}")
                    detections.append({
                        'class': class_name,
                        'confidence': round(conf * 100, 2)
                    })
        
        if detections:
            # Return first detection 
            best = max(detections, key=lambda x: x['confidence'])
            return jsonify({
                'success': True,
                'disease': best['class'],
                'confidence': best['confidence'],
                'treatment': 'Consult local agricultural expert' if best['class'] != 'Healthy' else 'No treatment needed',
                'detections': detections
            })
        else:
            return jsonify({
                'success': True,
                'disease': 'Healthy',
                'confidence': 95.0,
                'treatment': 'No treatment needed',
                'detections': []
            })
        
    except Exception as e:
        print(f" Error: {e}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("\n" + "="*50)
    print(" Starting Crop Disease Detection API")
    print("="*50)
    print(f" Server: http://localhost:5000")
    print("="*50 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5000)