import time, json
from core.message import AgentMessage
from core.guardrails import run_all_checks

EC5 = "EC5_OUT_OF_DOMAIN"

async def run(score_msg: AgentMessage, requested_amount: float) -> AgentMessage:
    start = time.time()
    profile = score_msg.data.get('bharosa_profile', {})
    edge_cases = profile.get('edge_cases_detected', [])
    
    income = profile.get('avg_monthly_income', 0)
    bounces = profile.get('bounce_count', 0)
    score = profile.get('bharosa_score', 0)
    
    comp_result = run_all_checks(score, income, bounces, requested_amount)
    if "DOMAIN_BOUNDARY" in comp_result.get("failed_checks", []):
        if EC5 not in edge_cases:
            edge_cases.append(EC5)
    
    borderline_review = None
    
    if profile.get('is_borderline', False):
        try:
            from .llm_provider import llm
            prompt = f"""You are an RBI compliance officer reviewing a borderline credit case.
Score: {score} (borderline 50-60)
Profile: {profile}
Edge cases: {edge_cases}

Return ONLY JSON:
{{
  "borderline_decision": "APPROVE_CONDITIONAL",
  "justification": "string",
  "additional_conditions": ["list"],
  "compliance_confidence": 80
}}
Return ONLY valid JSON. No markdown."""

            resp, provider = await llm.chat(prompt=prompt, system_prompt="Focus on RBI Master Circulars.", model_preference="groq")
            borderline_review = json.loads(resp.strip().replace('```json','').replace('```',''))
            comp_result['requires_deeper_review'] = True
            comp_result['llm_provider_used'] = provider
        except Exception as e:
            print(f"Compliance Agent Error: {e}")
            pass # Fallback silent

    proc_time = int((time.time() - start) * 1000)
    return AgentMessage(
        agent_name="compliance_agent",
        status="SUCCESS",
        data={"compliance_result": comp_result, "borderline_review": borderline_review},
        processing_time_ms=proc_time,
        next_agent="decision_agent"
    )
