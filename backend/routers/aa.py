from fastapi import APIRouter
import uuid
from datetime import datetime

router = APIRouter()

SUPPORTED_BANKS = [
    {"id": "canara", "name": "Canara Bank", "branch": "Karnataka", "api_count": 4},
    {"id": "sbi", "name": "State Bank of India", "branch": "All States", "api_count": 2},
    {"id": "punjab_sind", "name": "Punjab and Sind Bank", "branch": "Delhi", "api_count": 3},
    {"id": "iob", "name": "Indian Overseas Bank", "branch": "Tamil Nadu", "api_count": 4},
    {"id": "central_bank", "name": "Central Bank of India", "branch": "Maharashtra", "api_count": 2},
    {"id": "uco", "name": "UCO Bank", "branch": "West Bengal", "api_count": 1},
    {"id": "cibil", "name": "Transunion CIBIL Limited", "branch": "Maharashtra", "api_count": 1},
]

@router.get("/aa/banks")
def get_banks():
    return {"banks": SUPPORTED_BANKS}

@router.post("/aa/consent")
def create_consent(body: dict):
    bank_id = body.get("bank_id", "iob")
    bank = next(
        (b for b in SUPPORTED_BANKS
         if b["id"] == bank_id),
        SUPPORTED_BANKS[0]
    )
    return {
        "consent_id": str(uuid.uuid4()),
        "bank": bank,
        "status": "APPROVED",
        "data_range": "Last 90 days",
        "data_types": [
            "Account Statement",
            "Transaction History",
            "Balance Information"
        ],
        "generated_at": datetime.now()
            .isoformat(),
        "aa_framework": "APISETU v3.0",
        "compliance": "RBI AA Framework"
    }

from .scoring_engine import get_score

@router.post("/aa/fetch")
def fetch_bank_data(body: dict):
    consent_id = body.get("consent_id")
    profile_data = body.get("profile_data", {
        "annual_income": 45000,
        "outstanding_debt": 12000,
        "delayed_payments": 1,
        "num_bank_accounts": 2
    })
    
    # Calculate score using local engine
    bharosa_score = get_score(profile_data)
    
    return {
        "consent_id": consent_id,
        "status": "FETCHED",
        "source": "Account Aggregator",
        "bank": "Canara Bank",
        "records_fetched": 180,
        "date_range": "Oct 2024 — Mar 2025",
        "bharosa_score": int(bharosa_score), # score is int
        "message": "Analysis complete! Your score is ready."
    }