from google.cloud import firestore
from datetime import datetime
import logging

# Initialize Firestore
db = firestore.Client()

class VaultService:
    @staticmethod
    def store_asset_metadata(metadata: dict):
        """
        Saves the asset's 'Digital Fingerprint' to Firestore.
        metadata should contain: asset_id, owner_id, sha256, phash
        """
        try:
            doc_ref = db.collection("assets").document(metadata["asset_id"])
            doc_ref.set({
                **metadata,
                "created_at": datetime.utcnow(),
                "status": "protected"
            })
            return True
        except Exception as e:
            logging.error(f"Vault Storage Error: {e}")
            return False

    @staticmethod
    def fetch_all_phashes():
        """
        Retrieves all pHashes from the vault for similarity scanning.
        In a production environment, you'd use BigQuery or a Vector DB,
        but for the Challenge, a Firestore collection scan works great.
        """
        assets_ref = db.collection("assets")
        docs = assets_ref.stream()
        return [{"asset_id": doc.id, "phash": doc.to_dict().get("phash")} for doc in docs]