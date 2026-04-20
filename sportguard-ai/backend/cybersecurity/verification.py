import imagehash
from hashing import HashingEngine
from watermarking import extract_watermark

class VerificationEngine:
    @staticmethod
    def check_integrity(suspect_image_bytes: bytes, original_sha256: str):
        """Checks for bit-for-bit identical matches."""
        suspect_sha256 = HashingEngine.generate_hashes(suspect_image_bytes)["sha256"]
        return suspect_sha256 == original_sha256

    @staticmethod
    def check_provenance(suspect_phash_str: str, vault_phash_str: str, threshold: int = 5):
        """
        Compares pHashes using Hamming Distance.
        A distance <= 5 usually means the images are visually the same asset.
        """
        hash1 = imagehash.hex_to_hash(suspect_phash_str)
        hash2 = imagehash.hex_to_hash(vault_phash_str)
        
        distance = hash1 - hash2
        return {
            "is_match": distance <= threshold,
            "distance": distance
        }

    @staticmethod
    def verify_silent_signature(image_path):
        """Attempts to extract the hidden Brand ID."""
        try:
            brand_id = extract_watermark(image_path)
            return {"authenticated": True, "brand_id": brand_id}
        except Exception:
            return {"authenticated": False, "brand_id": None}