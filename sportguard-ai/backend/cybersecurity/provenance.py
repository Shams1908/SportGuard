import uuid
from cybersecurity.hashing import HashingEngine

def prepare_metadata(image_bytes: bytes, owner_id: str):
    """Packages hashes and IDs for Firestore storage[cite: 200]."""
    engine = HashingEngine()
    hashes = engine.generate_hashes(image_bytes)
    
    return {
        "asset_id": str(uuid.uuid4()), # Unique Vault ID [cite: 139]
        "owner_id": owner_id,
        "sha256": hashes["sha256"],
        "phash": hashes["phash"]
    }