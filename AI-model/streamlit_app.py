import streamlit as st
from ultralytics import YOLO
import cv2
import numpy as np
from PIL import Image
import os

st.set_page_config(
    page_title="Crop Disease Detection",
    page_icon="",
    layout="wide"
)

st.title(" Crop Disease Detection")
st.write("Upload a leaf image to detect disease")

# Load model
@st.cache_resource
def load_model():
    model_path = "best.pt"
    if not os.path.exists(model_path):
        st.error(f" Model not found at {model_path}")
        st.stop()
    return YOLO(model_path)

try:
    model = load_model()
    st.success(" Model loaded successfully!")
except Exception as e:
    st.error(f" Model load failed: {e}")
    st.stop()

# Class names
CLASS_NAMES = {
    0: "Brown Spot",
    1: "Healthy"
}

# Create two columns
col1, col2 = st.columns([1, 1])

with col1:
    uploaded_file = st.file_uploader(" Choose a leaf image...", type=['jpg', 'jpeg', 'png'])
    
    if uploaded_file is not None:
        image = Image.open(uploaded_file)
        st.image(image, caption="Uploaded Image", width=400)
        
        if st.button(" Detect Disease", type="primary"):
            with st.spinner(" Analyzing..."):
                # Convert to OpenCV format
                img_array = np.array(image)
                img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
                
                # Predict
                results = model(img_bgr)
                
                # Show results in column 2
                with col2:
                    st.subheader(" Results")
                    
                    detections = []
                    for r in results:
                        boxes = r.boxes
                        if boxes:
                            for box in boxes:
                                cls = int(box.cls[0])
                                conf = float(box.conf[0])
                                class_name = CLASS_NAMES.get(cls, f"Class_{cls}")
                                detections.append((class_name, conf))
                    
                    if detections:
                        for class_name, conf in detections:
                            if class_name.lower() == "healthy":
                                st.success(f" {class_name}: {conf:.2%}")
                                st.info(" No treatment needed. Continue regular care.")
                            else:
                                st.error(f" {class_name}: {conf:.2%}")
                                st.warning(" Apply recommended fungicide. Consult local expert.")
                    else:
                        st.info(" No disease detected! Leaf is healthy.")
                    
                    # Show image with boxes
                    result_img = results[0].plot()
                    st.image(result_img, caption="Detection Result", width=400)

# Footer
st.markdown("---")
st.markdown("© 2026 Smart Agri. All rights reserved.")