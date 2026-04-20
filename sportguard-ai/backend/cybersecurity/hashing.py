import hashlib
import imagehash
from PIL import Image
import io

class HashingEngine:
    @staticmethod
    def generate_hashes(image_bytes: bytes):
        """Generates bit-level (SHA-256) and visual (pHash) hashes."""
        # 1. SHA-256 for bit-for-bit integrity [cite: 122, 199]
        sha256_hash = hashlib.sha256(image_bytes).hexdigest()
        
        # 2. pHash to detect resized or modified versions [cite: 123, 200]
        img = Image.open(io.BytesIO(image_bytes))
        perceptual_hash = str(imagehash.phash(img))
        
        return {
            "sha256": sha256_hash,
            "phash": perceptual_hash
        }