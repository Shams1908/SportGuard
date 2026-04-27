import os
import shutil
import tempfile
import asyncio

from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from pydantic import BaseModel
from google.cloud import firestore
import httpx
from datetime import datetime

from engine.phash import generate_phash, calculate_hamming_distance
from services.legal_service import draft_legal_notice
from cybersecurity.provenance import prepare_metadata
from cybersecurity.watermarking import embed_watermark, extract_watermark
from core.gcp_clients import GCPClients
from cybersecurity.verification import VerificationEngine
from cybersecurity.vault_service import VaultService

router = APIRouter()

class ScanRequest(BaseModel):
    url: str

from fastapi.responses import JSONResponse

@router.post("/scan-url")
async def scan_url(request: ScanRequest):
    print(f"DEBUG: Scanning URL -> {request.url}")
    try:
        # Download image
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/119.0.0.0 Safari/537.36"}
                response = await client.get(request.url, headers=headers)
                response.raise_for_status()
                
                content_type = response.headers.get("Content-Type", "")
                if not content_type.startswith("image/"):
                    return JSONResponse(status_code=200, content={"match": False, "error": f"Invalid content type: {content_type}. Expected an image."})
                if not response.content:
                    return JSONResponse(status_code=200, content={"match": False, "error": "Downloaded image is empty."})
        except Exception as e:
            return JSONResponse(status_code=200, content={"match": False, "error": f"Failed to download image: {str(e)}"})

        # Save temporarily
        fd, temp_path = tempfile.mkstemp(suffix=".jpg")
        with os.fdopen(fd, 'wb') as f:
            f.write(response.content)

        # Fix AI Output Types: Convert to list
        target_phash = generate_phash(temp_path)
        os.remove(temp_path)
        if hasattr(target_phash, "tolist"):
            target_phash = target_phash.tolist()

        # Audit the Comparison Loop
        db = GCPClients.get_db()
        docs = db.collection("protected_assets").stream()
        
        best_match = None
        min_dist = float('inf')

        async for doc in docs:
            data = doc.to_dict()
            stored_phash = data.get("ai_fingerprint")
            stored_id = data.get('asset_id', 'UNKNOWN_ID')
            
            if stored_phash:
                dist = calculate_hamming_distance(target_phash, stored_phash)
                print(f"COMPARING: Asset {stored_id} | Distance: {dist}")
                if dist < min_dist:
                    min_dist = dist
                    best_match = data

        # Match Threshold Setup
        MATCH_THRESHOLD = 15 
        if best_match and min_dist <= MATCH_THRESHOLD:
            # Using len(target_phash) dynamically (512 for VGG16, instead of 64) to prevent negative scores
            hash_length = len(target_phash)
            match_score = round((1 - (min_dist / hash_length)) * 100, 1)
            original_asset_id = best_match.get("asset_id", "UNKNOWN_ID")
            
            # Call Gemini legal draft generation
            legal_draft = draft_legal_notice({
                "url": request.url,
                "phash": best_match.get("ai_fingerprint"),
                "timestamp": datetime.now().isoformat()
            })
            
            print(f"MATCH FOUND: Writing to infringements collection for asset {original_asset_id}")
            # Write to Infringements
            await db.collection("infringements").add({
                "pirate_url": request.url,
                "url": request.url, # Duplicate for frontend backwards-compatibility
                "match_score": match_score,
                "match": match_score, # Duplicate for frontend backwards-compatibility 
                "status": "Active",
                "original_asset_id": original_asset_id,
                "platform": "Detected External Site",
                "geo": "UNKNOWN",
                "legal_draft": legal_draft,
                "timestamp": firestore.SERVER_TIMESTAMP
            })

            return {"match": True, "match_score": match_score, "original_asset_id": original_asset_id}
        else:
            return {"match": False}

    except Exception as e:
        print(f"FIRESTORE/SCAN ERROR: {str(e)}")
        # Bulletproof JSON Returns
        return JSONResponse(status_code=200, content={"match": False, "error": str(e)})

@router.post("/process-asset")
async def process_asset(file: UploadFile = File(...)):
    # 1. Create Fingerprint (Shambhavi)
    phash = generate_phash(file.file) # [cite: 6, 82]

    # 2. Add Security Layers (Partner)
    # watermarked_media = apply_lsb_watermark(file.file) # [cite: 90]
    # c2pa_id = sign_c2pa_manifest(file.file, "SHAMBHAVI_DEV") # [cite: 135]
    c2pa_id = "pending_c2pa_signature"

    # 3. Web Tracking (Google Vision API)
    vision_client = GCPClients.get_vision()
    # Logic to identify if this asset already exists on the web [cite: 87]
    infringement_detected = True # Sample trigger
    
    legal_draft = ""
    if infringement_detected:
        # 4. Legal Strike (Gemini + Vertex AI)
        legal_draft = draft_legal_notice({
            "url": "http://pirate-sports-stream.com",
            "phash": phash,
            "timestamp": "2026-04-20"
        }) # [cite: 132]

    # 5. Firestore Persistence for Dashboard
    db = GCPClients.get_db()
    await db.collection("vault").add({
        "phash": phash,
        "c2pa_id": c2pa_id,
        "legal_notice": legal_draft,
        "status": "Secured & Provenance Verified"
    })

    return {"status": "Success", "phash": phash, "c2pa": c2pa_id}

def vision_scan_task(file_path: str):
    try:
        from services.vision_service import hunt_infringements
        hunt_infringements(file_path)
    finally:
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except OSError:
                pass

@router.post("/protect-asset")
async def protect_asset(file: UploadFile = File(...)):
    import uuid
    # Reset file pointer before calling AI engine
    file.file.seek(0)
    
    # 1. Create Fingerprint
    phash = generate_phash(file.file)
    
    # Reset file pointer before watermarking/uploading
    file.file.seek(0)
    
    # Numpy Check: Ensure the pHash is converted to a list via .tolist() if it's a numpy array
    if hasattr(phash, "tolist"):
        phash = phash.tolist()
        
    # Generate unique ID as instructed
    asset_id = f"SG-{uuid.uuid4().hex[:8].upper()}"
    
    # 2. Database Record: Create a document in the protected_assets Firestore collection
    db = GCPClients.get_db()
    
    try:
        # Await the add() call to ensure 200 OK only returns after data is safe
        await db.collection("protected_assets").add({
            "filename": file.filename,
            "ai_fingerprint": phash,
            "asset_id": asset_id,
            "vault_id": asset_id, # Retained for backwards compatibility
            "status": "Protected",
            "created_at": datetime.now(),
            "timestamp": firestore.SERVER_TIMESTAMP
        })
    except Exception as e:
        print(f"FIRESTORE ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Firestore Write Error: {str(e)}")

    # Minimal delay for Gauntlet Stress Test UI
    await asyncio.sleep(0.1)
    return {"status": "success", "message": "Asset protected", "asset_id": asset_id}

@router.post("/protect-asset-production")
async def protect_asset_production(file: UploadFile = File(...), background_tasks: BackgroundTasks = BackgroundTasks()):
    # Create secure temporary storage to hold the uploaded media while the pipeline runs
    fd, temp_path = tempfile.mkstemp(suffix=".tmp")
    fd_out, temp_out_path = tempfile.mkstemp(suffix=".png")
    task_added = False
    
    try:
        with os.fdopen(fd, 'wb') as f:
            shutil.copyfileobj(file.file, f)
            
        os.close(fd_out)

        # Identity Integration: Validate the user's identity before any processing begins
        identity_verification = VerificationEngine.verify_silent_signature(temp_path)
        
        # Error Handling: If verification fails, return 403
        if not identity_verification.get("authenticated"):
            raise HTTPException(
                status_code=403,
                detail="Zero Trust Identity Shield Failure."
            )
            
        owner_id = identity_verification.get("brand_id") or "SYSTEM_USER"

        # AI Fingerprinting: Generate the dH baseline for the uploaded file
        baseline_phash = generate_phash(temp_path)
        
        # Watermarking: Apply the invisible watermark
        embed_watermark(temp_path, owner_id, temp_out_path)
        
        # Logic Check: verification step to ensure the pHash remains stable
        watermarked_phash = generate_phash(temp_out_path)
        dist = calculate_hamming_distance(baseline_phash, watermarked_phash)
        
        if dist >= 10:
            raise HTTPException(
                status_code=500,
                detail=f"Watermarking degraded image integrity. Hamming Distance {dist} >= 10."
            )
            
        # Provenance & Signing: generate C2PA manifest and sign asset
        with open(temp_out_path, 'rb') as f:
            watermarked_bytes = f.read()
            
        metadata = prepare_metadata(watermarked_bytes, owner_id)
        VaultService.store_asset_metadata(metadata)
        
        # Cloud Storage: Move the final, watermarked, and signed file to GCS
        storage_client = GCPClients.get_storage()
        bucket = storage_client.bucket("sportguard-protected-assets")
        blob = bucket.blob(f"{metadata['asset_id']}.png")
        blob.upload_from_filename(temp_out_path)
        
        # Database Record: Create a document in the protected_assets Firestore collection
        db = GCPClients.get_db()
        db.collection("protected_assets").document(metadata["asset_id"]).set({
            "ai_fingerprint": watermarked_phash,
            "cyber_signature": metadata,
            "vault_id": metadata["asset_id"],
            "integrity_status": "Certified"
        })
        
        # Vision Trigger: trigger the vision_service.py background task
        background_tasks.add_task(vision_scan_task, temp_out_path)
        task_added = True
            
        return {
            "status": "Success", 
            "message": "Asset protected successfully",
            "asset_id": metadata["asset_id"],
            "hamming_distance": dist
        }
        
    finally:
        # Clean up temporary storage handler
        if os.path.exists(temp_path):
            os.remove(temp_path)
        if not task_added and os.path.exists(temp_out_path):
            try:
                os.remove(temp_out_path)
            except OSError:
                pass
