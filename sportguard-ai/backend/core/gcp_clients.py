from google.cloud import vision, firestore, storage

class GCPClients:
    """Singleton to manage GCP services efficiently."""
    _vision_client = None
    _db = None

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
