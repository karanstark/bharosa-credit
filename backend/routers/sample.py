from fastapi import APIRouter
from fastapi.responses import JSONResponse
import os
from agents.orchestrator import BharosaOrchestrator
from data.mock_reports import MOCK_REPORTS

router = APIRouter(prefix="/analyze/sample", tags=["sample"])

@router.post("/{profile_type}")
async def analyze_sample(profile_type: str):
    # Instant Cache 
    if profile_type in MOCK_REPORTS:
        return JSONResponse(content=MOCK_REPORTS[profile_type])
        
    file_path = os.path.join(os.path.dirname(__file__), "..", "data", "sample_profiles", f"{profile_type}_profile.csv")
    if not os.path.exists(file_path):
        return {"error": "Sample profile not found."}
        
    orchestrator = BharosaOrchestrator()
    report = await orchestrator.run(file_path, requested_amount=20000.0)
    return JSONResponse(content=report)
