import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "SportGuard AI"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    GCP_KEY_PATH: str = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
settings = Settings()