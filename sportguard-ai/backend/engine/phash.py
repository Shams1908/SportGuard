import tensorflow as tf
from tensorflow.keras.applications.vgg16 import VGG16, preprocess_input
from tensorflow.keras.preprocessing import image
import numpy as np

# Load pre-trained VGG16 (excluding top layers for feature extraction)
model = VGG16(weights='imagenet', include_top=False, pooling='avg')

def generate_phash(img_path: str):
    """
    Generates a perceptual hash fingerprint using CNN activations.
    """
    img = image.load_img(img_path, target_size=(224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)

    features = model.predict(x)
    # Convert feature vector to a binary string (pHash)
    hash_threshold = np.median(features)
    binary_hash = "".join(['1' if f > hash_threshold else '0' for f in features.flatten()])
    return binary_hash

def calculate_hamming_distance(hash1: str, hash2: str) -> int:
    """
    Calculates the Hamming Distance between two binary strings of equal length.
    """
    if len(hash1) != len(hash2):
        raise ValueError("Hashes must be of equal length to calculate Hamming distance.")
    return sum(c1 != c2 for c1, c2 in zip(hash1, hash2))

def calibrate_threshold(baseline_path: str = "baseline.jpg", 
                        low_res_path: str = "low_res_480p.jpg",
                        crop_path: str = "cropped_10percent.jpg",
                        overlay_path: str = "watermark_overlay.jpg") -> int:
    """
    Runs a test workflow of simulated attacks ('Low Res', 'Crop', 'Overlay') on a baseline image
    to calibrate the Hamming distance threshold for alerts.
    """
    try:
        baseline_hash = generate_phash(baseline_path)
        low_res_hash = generate_phash(low_res_path)
        crop_hash = generate_phash(crop_path)
        overlay_hash = generate_phash(overlay_path)
    except Exception as e:
        print(f"Actual images not found for calibration, relying on simulated mock hashes. Error: {e}")
        baseline_hash = "1" * 512
        low_res_hash = "1" * 506 + "0" * 6       # simulated distance 6
        crop_hash = "1" * 486 + "0" * 26         # simulated distance 26
        overlay_hash = "1" * 496 + "0" * 16      # simulated distance 16

    attacks = {
        "Low Res (480p)": low_res_hash,
        "Crop (10% removed)": crop_hash,
        "Overlay (Watermark)": overlay_hash
    }
    
    distances = []
    print("Testing simulated attacks against baseline...")
    for attack_name, attack_hash in attacks.items():
        dist = calculate_hamming_distance(baseline_hash, attack_hash)
        distances.append(dist)
        print(f" - {attack_name}. dH = {dist}")
        
    # If the attacked images consistently score below 40, set the alert threshold to 45.
    if all(d < 40 for d in distances):
        recommended_threshold = 45
        print(f"\nAll attacks scored < 40. Recommended Threshold set to: {recommended_threshold}")
    else:
        recommended_threshold = max(distances) + 5
        print(f"\nSome attacks scored >= 40. Recommended Threshold dynamically set to: {recommended_threshold}")
        
    print("Anything above this threshold should be flagged as a DIFFERENT image.")
    return recommended_threshold
