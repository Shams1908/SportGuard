from google.cloud import vision, firestore, storage
import os

class GCPClients:
    """Singleton to manage GCP services efficiently."""
    _vision_client = None
    _db = None
    _storage_client = None

    @classmethod
    def get_vision(cls):
        if cls._vision_client is None:
            if os.path.exists("gcp-key.json"):
                cls._vision_client = vision.ImageAnnotatorClient.from_service_account_file("gcp-key.json")
            else:
                cls._vision_client = vision.ImageAnnotatorClient()
        return cls._vision_client

    @classmethod
    def get_db(cls):
        if cls._db is None:
            if os.path.exists("gcp-key.json"):
                cls._db = firestore.AsyncClient.from_service_account_json("gcp-key.json")
            else:
                cls._db = firestore.AsyncClient()
        return cls._db

    @classmethod
    def get_storage(cls):
        if cls._storage_client is None:
            if os.path.exists("gcp-key.json"):
                cls._storage_client = storage.Client.from_service_account_json("gcp-key.json")
            else:
                cls._storage_client = storage.Client()
        return cls._storage_client
