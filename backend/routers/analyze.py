from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import io
from fastapi.responses import JSONResponse
import shutil
import os
import uuid
from agents.orchestrator import BharosaOrchestrator

router = APIRouter(prefix="/analyze", tags=["analyze"])

class AnalyzeRequest(BaseModel):
    transactions: Optional[List[dict]] = None
    requested_amount: float = 20000.0
    reference_number: Optional[str] = None

@router.post("")
async def analyze_data(request: AnalyzeRequest):
    data = {"transactions": request.transactions}
    
    if not request.transactions:
        # Demo mode: load a sample profile and convert to JSON-like dict
        sample_path = os.path.join(os.path.dirname(__file__), "..", "data", "sample_profiles", "good_profile.csv")
        if os.path.exists(sample_path):
            df = pd.read_csv(sample_path)
            data = {"transactions": df.to_dict(orient='records')}
        else:
            raise HTTPException(404, {"error": "Sample data not found", "hint": "Please provide transactions JSON"})
            
    orchestrator = BharosaOrchestrator()
    report = await orchestrator.run(data, requested_amount=request.requested_amount)
    
    return JSONResponse(content=report)

@router.post("/domain-check")
async def domain_check(body: dict):
    domain = body.get("domain", "")
    
    if not domain or len(domain) < 2:
        return {
            "domain": domain,
            "in_scope": False,
            "action": "ESCALATE",
            "audit_entry": "Empty or invalid domain input — escalated by default",
            "hint": "BharosaCredit only processes financial credit scoring"
        }
    
    from core.guardrails import check_domain_scope
    result = check_domain_scope(domain)
    return {
        "domain": domain,
        **result
    }

@router.post("/sample/edge")
async def analyze_edge():
    file_path = os.path.join(os.path.dirname(__file__), "..", "data", "sample_profiles", "edge_profile.csv")
    if not os.path.exists(file_path):
        return {"error": "Edge profile not found. Please run generator.py first."}
        
    orchestrator = BharosaOrchestrator()
    report = await orchestrator.run(file_path, requested_amount=25000.0)
    return JSONResponse(content=report)
