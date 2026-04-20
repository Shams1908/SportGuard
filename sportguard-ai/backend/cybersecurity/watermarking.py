import numpy as np
from PIL import Image

# Delimiter signals the end of our hidden message [cite: 138, 202]
DELIMITER = '1111111111111110'

def embed_watermark(image_path, brand_id, output_path):
    """Hides a Brand ID in the image pixels[cite: 202]."""
    img = Image.open(image_path).convert('RGB')
    data = np.array(img)
    
    # Convert ID to binary + delimiter [cite: 138]
    binary_secret = ''.join(format(ord(c), '08b') for c in brand_id) + DELIMITER
    
    flattened = data.flatten()
    for i, bit in enumerate(binary_secret):
        if i < len(flattened):
            # Adjust the Least Significant Bit [cite: 137]
            flattened[i] = (flattened[i] & ~1) | int(bit)
        
    new_data = flattened.reshape(data.shape)
    # MUST save as PNG to maintain data integrity [cite: 146, 223]
    Image.fromarray(new_data.astype('uint8')).save(output_path, "PNG")

def extract_watermark(image_path):
    """Retrieves the hidden Brand ID from a suspect image[cite: 203]."""
    img = Image.open(image_path).convert('RGB')
    pixels = np.array(img).flatten()
    
    binary_data = ""
    for p in pixels:
        binary_data += str(p & 1)
        if binary_data.endswith(DELIMITER):
            break
            
    # Remove delimiter and convert back to string [cite: 203]
    binary_data = binary_data[:-len(DELIMITER)]
    chars = [binary_data[i:i+8] for i in range(0, len(binary_data), 8)]
    return "".join([chr(int(c, 2)) for c in chars])