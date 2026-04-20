# Direct import since they are in the same folder
'''from security_utils import validate_user_integrity
from fastapi import HTTPException

def run_test():
    mock_token = {"uid": "athlete_123"}
    
    print("--- STARTING SECURITY CONNECTION TEST ---")

    # Test 1: Valid User
    try:
        validate_user_integrity("athlete_123", mock_token)
        print("✅ CONNECTION SUCCESS: security_utils.py is reachable and working.")
    except Exception as e:
        print(f"❌ CONNECTION ERROR: Could not verify valid user. Error: {e}")

    # Test 2: Hacker Attempt
    try:
        print("Checking hacker block...")
        validate_user_integrity("hacker_99", mock_token)
    except HTTPException as e:
        print(f"✅ SECURITY SUCCESS: Hacker was blocked with code {e.status_code}")
        print(f"Message: {e.detail}")

    print("--- TEST COMPLETE ---")

if __name__ == "__main__":
    run_test()'''