import os
from dotenv import load_dotenv

# Load environment variables from the .env file if present
load_dotenv()

class Config:
    """
    Centralized configuration management for SportGuard AI.
    Pulls gracefully from local .env or injected cloud environment variables.
    """
    
    # 1. Google Cloud Authentication
    # The Singleton GCPClients depend on this standard environment variable for default auth
    GCP_CREDENTIALS_PATH = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    
    if GCP_CREDENTIALS_PATH:
        # Explicitly bind it to the runtime env so Google Client libraries find it automatically
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = GCP_CREDENTIALS_PATH

    # 2. Gemini AI Configuration
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    
    if GEMINI_API_KEY:
        os.environ["GEMINI_API_KEY"] = GEMINI_API_KEY
    
    # 3. Standard GCP Configurations
    PROJECT_ID = os.getenv("GCP_PROJECT_ID", "sportguard-ai-test")

# Pre-instantiate to apply validations and logic on import
settings = Config()
