import os
import sys
import asyncio
import random
import time
from datetime import datetime, timedelta
sys.path.append(os.path.dirname(
    os.path.abspath(__file__)))
import config

from fastapi import FastAPI
from fastapi.middleware.cors import (
    CORSMiddleware)
from routers import analyze, sample, aa, banking as banking_router
from agents.orchestrator import (
    BharosaOrchestrator)
from fastapi.responses import JSONResponse
from fastapi.requests import Request

app = FastAPI(title="BharosaCredit API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)
app.include_router(sample.router)
app.include_router(aa.router)
app.include_router(banking_router.router)

@app.exception_handler(Exception)
async def global_exception_handler(
    request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Something went wrong",
            "detail": str(exc),
            "hint": "Try using a sample profile",
            "app": "BharosaCredit",
            "status": 500
        }
    )

@app.exception_handler(404)
async def not_found_handler(
    request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "error": "Endpoint not found",
            "hint": "Check API documentation",
            "available_endpoints": [
                "POST /analyze",
                "POST /analyze/sample/{type}",
                "POST /analyze/domain-check",
                "GET /pipeline/status",
                "GET /aa/banks",
                "POST /aa/consent",
                "POST /aa/fetch"
            ]
        }
    )

@app.on_event("startup")
async def startup_event():
    async def pre_warm_worker():
        try:
            print("Pre-warming pipeline in background...")
            good_path = os.path.join(
                os.path.dirname(
                    os.path.abspath(__file__)),
                'data', 'sample_profiles',
                'good_profile.csv')
            if os.path.exists(good_path):
                orch = BharosaOrchestrator()
                await orch.run(good_path)
                print("Pipeline pre-warmed successfully.")
        except Exception as e:
            print("Pre-warm background worker failed:", e)
    
    # Create background task so server starts immediately
    asyncio.create_task(pre_warm_worker())

from pydantic import BaseModel
import json

class UserRegistration(BaseModel):
    firebase_uid: str
    first_name: str
    last_name: str
    age: int
    phone: str
    address: str
    country: str
    state: str = ""
    profession: str
    email: str

class SMSRequest(BaseModel):
    phone: str

class SMSVerifyRequest(BaseModel):
    phone: str
    otp: str
    session_id: str

# User's provided 2Factor API key
TWO_FACTOR_API_KEY = "d6155eb7-279d-11f1-bcb0-0200cd936042"

@app.post("/api/sms/send-otp")
async def send_2factor_otp(request: SMSRequest):
    """Triggers 2Factor's AUTOGEN OTP service"""
    # Clean phone number: remove +, spaces, and ensure 91 prefix for India
    clean_phone = request.phone.replace("+", "").replace(" ", "").strip()
    
    # If it's a 10 digit number, assume India (91)
    if len(clean_phone) == 10:
        clean_phone = "91" + clean_phone
        
    url = f"https://2factor.in/API/V1/{TWO_FACTOR_API_KEY}/SMS/{clean_phone}/AUTOGEN"
    print(f"[2Factor] Requesting OTP for: {clean_phone}")
    
    try:
        import requests
        response = requests.get(url)
        data = response.json()
        print(f"[2Factor] Response: {data}")
        
        if data.get("Status") == "Success":
            return {"status": "success", "session_id": data.get("Details")}
        else:
            return JSONResponse(status_code=400, content={"error": data.get("Details")})
    except Exception as e:
        print(f"[2Factor] Exception: {str(e)}")
        return JSONResponse(status_code=500, content={"error": f"SMS Gateway Error: {str(e)}"})

@app.post("/api/sms/verify-otp")
async def verify_2factor_otp(request: SMSVerifyRequest):
    """Verifies the OTP via 2Factor"""
    url = f"https://2factor.in/API/V1/{TWO_FACTOR_API_KEY}/SMS/VERIFY/{request.session_id}/{request.otp}"
    print(f"[2Factor] Verifying Session: {request.session_id} with OTP: {request.otp}")
    
    try:
        import requests
        response = requests.get(url)
        data = response.json()
        print(f"[2Factor] Verify Response: {data}")
        
        if data.get("Status") == "Success" or data.get("Details") == "OTP Matched":
            return {"status": "success", "message": "Verified"}
        else:
            return JSONResponse(status_code=400, content={"error": data.get("Details")})
    except Exception as e:
        print(f"[2Factor] Verify Exception: {str(e)}")
        return JSONResponse(status_code=500, content={"error": f"Verification Error: {str(e)}"})

@app.post("/api/register")
async def register_user(user: UserRegistration):
    try:
        users_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'users.json')
        os.makedirs(os.path.dirname(users_file), exist_ok=True)
        
        if os.path.exists(users_file):
            with open(users_file, 'r') as f:
                try:
                    users_data = json.load(f)
                except json.JSONDecodeError:
                    users_data = []
        else:
            users_data = []
            
        users_data.append(user.dict())
        
        with open(users_file, 'w') as f:
            json.dump(users_data, f, indent=4)
            
        return {"status": "success", "message": "User registered successfully"}
    except Exception as e:
        print(f"Error saving user: {e}")
        return JSONResponse(status_code=500, content={"error": "Failed to save user data"})

@app.get("/")
def read_root():
    return {
        "status": "ok",
        "app": "BharosaCredit",
        "agents": 7,
        "autonomy_steps": 7,
        "compliance": "RBI Guidelines",
        "aa_framework": "APISETU v3.0",
        "aa_endpoints": [
            "GET /aa/banks",
            "POST /aa/consent",
            "POST /aa/fetch"
        ]
    }

@app.get("/pipeline/status")
def get_pipeline_status():
    return {
        "agents": [
            "data_agent",
            "feature_agent",
            "scoring_agent",
            "compliance_agent",
            "decision_agent",
            "explanation_agent",
            "report_agent"
        ],
        "llm_routing": {
            "decisions": "groq",
            "explanations": "gemini"
        },
        "compliance": "RBI Guidelines",
        "autonomy_steps": 7,
        "aa_framework": "APISETU v3.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)