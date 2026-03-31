import time, os, json
from core.message import AgentMessage

EC6 = "EC6_LLM_FAILURE"

async def run(profile_msg: AgentMessage, comp_msg: AgentMessage) -> AgentMessage:
    start = time.time()
    profile = profile_msg.data.get('bharosa_profile', {})
    comp_data = comp_msg.data.get('compliance_result', {})
    edge_cases = profile.get('edge_cases_detected', [])
    llm_used = "none"
    warnings = []
    
    if not comp_data.get('passed', True):
        decision = {
            "decision": "REJECT",
            "loan_amount_recommended": 0,
            "interest_rate": "N/A",
            "tenure_months": 0,
            "confidence": 100,
            "key_positive_signals": [],
            "key_risk_signals": ["Failed RBI Compliance"],
            "conditions": [],
            "audit_trail": ["Step 1: Automated RBI compliance failed limit/score checks. Auto-rejected."]
        }
        return AgentMessage("decision_agent", "SUCCESS", {"decision": decision, "llm_used": llm_used}, processing_time_ms=int((time.time()-start)*1000), next_agent="explanation_agent")
    
    prompt = f"""You are a credit officer at an Indian NBFC following RBI guidelines. Reviewing a gig/informal worker.
Bharosa Profile: {profile}
Compliance: {comp_data}
Edge Cases: {edge_cases}

Return ONLY JSON:
{{
  "decision": "APPROVE",
  "loan_amount_recommended": 20000,
  "interest_rate": "13%",
  "tenure_months": 12,
  "confidence": 85,
  "key_positive_signals": ["sig1", "sig2", "sig3"],
  "key_risk_signals": ["risk1", "risk2", "risk3"],
  "conditions": [],
  "audit_trail": ["Step 1:...", "Step 2:...", "Step 3:..."]
}}
Return ONLY valid JSON. No markdown."""

    try:
        from .llm_provider import llm
        
        # Use our new LLMProvider (Ollama -> Groq -> Gemini fallback)
        resp_text, provider = await llm.chat(prompt=prompt, system_prompt="You are a credit officer at an Indian NBFC following RBI guidelines.")
        print(f"Decision generated using: {provider}")
        
        resp = resp_text.strip().replace('```json','').replace('```','')
        decision = json.loads(resp)
        llm_used = provider
        
    except Exception as e:
        warnings.append(f"LLM decision failed: {str(e)}")
        if EC6 not in edge_cases: edge_cases.append(EC6)
        decision = {"decision": "APPROVE", "loan_amount_recommended": 10000, "interest_rate": "18%", "tenure_months": 6, "confidence": 50, "key_positive_signals": ["Fallback approval"], "key_risk_signals": ["System offline"], "conditions": [], "audit_trail": ["Step 1: Fallback"]}
            
    return AgentMessage("decision_agent", "SUCCESS", {"decision": decision, "llm_used": llm_used}, warnings=warnings, processing_time_ms=int((time.time()-start)*1000), next_agent="explanation_agent")
