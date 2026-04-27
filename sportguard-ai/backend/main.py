from fastapi import FastAPI, UploadFile, File, Request
from engine.phash import generate_phash
from core.gcp_clients import GCPClients
from cybersecurity.watermarking import embed_watermark # Partner's module
from api.routes import router as api_router
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import firestore
from fastapi.responses import JSONResponse
import traceback

app = FastAPI(title="SportGuard AI Core")
app.include_router(api_router)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error: {str(exc)}", "trace": traceback.format_exc()}
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/protect-media")
async def protect_media(file: UploadFile = File(...)):
    # 1. Generate pHash Fingerprint [cite: 6, 23]
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        buffer.write(await file.read())
    
    fingerprint = generate_phash(temp_path)

    # 2. Cybersecurity Layer: Digital Watermarking [cite: 8, 24]
    # This is where your partner's LSB logic integrates seamlessly.
    watermarked_path = f"wm_{temp_path}"
    embed_watermark(temp_path, "SG_2026_SHAMBHAVI", watermarked_path)

    # 3. Vision API Web Detection [cite: 7, 20, 25]
    vision_client = GCPClients.get_vision()
    # (Simplified Vision API call logic here...)
    
    # 4. Log to Firestore for Dashboard [cite: 19, 27]
    db = GCPClients.get_db()
    db.collection("assets").add({
        "filename": file.filename,
        "phash": fingerprint,
        "status": "Protected",
        "timestamp": firestore.SERVER_TIMESTAMP
    })

    return {
        "message": "Asset Protected & Fingerprinted",
        "fingerprint": fingerprint,
        "status": "Secure"
    }
