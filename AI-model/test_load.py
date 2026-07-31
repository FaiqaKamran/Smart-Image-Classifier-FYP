from ultralytics import YOLO
import os

print("="*50)
print(" Step 1: Model Load Check")
print("="*50)

# Check current directory
print(f" Current directory: {os.getcwd()}")

# Check if model exists
model_path = "best.pt"
if os.path.exists(model_path):
    print(f" Model found: {model_path}")
    print(f" Size: {os.path.getsize(model_path) / (1024*1024):.2f} MB")
else:
    print(f" Model NOT found at: {model_path}")
    print(" Please copy best.pt to this folder")
    exit()

# Load model
print("\n Loading model...")
try:
    model = YOLO(model_path)
    print(" Model loaded successfully!")
    print(f" Classes: {model.names}")
except Exception as e:
    print(f" Model load failed: {e}")
    import traceback
    traceback.print_exc()
    exit()

print("\n Step 1 complete!")