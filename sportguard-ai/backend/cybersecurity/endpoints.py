from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from hashing import HashingEngine
from verification import VerificationEngine
from vault_service import VaultService
from security_utils import limiter, validate_user_integrity

router = APIRouter()

@router.post("/verify")
@limiter.limit("5/minute")
async def verify_media_asset(request: Request, file: UploadFile = File(...), owner_id: str = None):
    """
    The 'Front Door' of SportGuard Security.
    Takes a file, checks the vault, and returns the authenticity status.
    """
    # 1. Read file
    contents = await file.read()
    
    # 2. Identify the suspect
    engine = HashingEngine()
    suspect_hashes = engine.generate_hashes(contents)
    
    # 3. Search the Vault (Firestore)
    # This calls your vault_service logic
    vault_records = VaultService.fetch_all_phashes()
    
    match_found = False
    confidence_score = 0
    
    for record in vault_records:
        result = VerificationEngine.check_provenance(
            suspect_hashes["phash"], 
            record["phash"]
        )
        if result["is_match"]:
            match_found = True
            # Distance 0 = 100% match, Distance 10 = low match
            confidence_score = max(0, 100 - (result["distance"] * 10))
            break

    return {
        "is_authentic": match_found,
        "confidence": f"{confidence_score}%",
        "algorithm": "pHash-Hamming-Distance",
        "integrity_status": "Verified" if match_found else "Unknown/Tampered"
    }