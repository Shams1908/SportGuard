from google.cloud import vision, firestore, storage

class GCPClients:
    """Singleton to manage GCP services efficiently."""
    _vision_client = None
    _db = None
    _storage_client = None

    @classmethod
    def get_vision(cls):
        if cls._vision_client is None:
            cls._vision_client = vision.ImageAnnotatorClient()
        return cls._vision_client

    @classmethod
    def get_db(cls):
        if cls._db is None:
            cls._db = firestore.Client()
        return cls._db

    @classmethod
    def get_storage(cls):
        if cls._storage_client is None:
            cls._storage_client = storage.Client()
        return cls._storage_client
