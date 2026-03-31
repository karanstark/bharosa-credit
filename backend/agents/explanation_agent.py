import time
from core.message import AgentMessage

async def run(profile_msg: AgentMessage, dec_msg: AgentMessage) -> AgentMessage:
    start = time.time()
    profile = profile_msg.data.get('bharosa_profile', {})
    dec = dec_msg.data.get('decision', {})
    
    prompt = f"""You are a warm financial assistant and a risk analyst. Generate three specific underwriting summaries for the following profile:
    
    PROFILE DATA:
    - Score: {profile.get('bharosa_score')}/100
    - Risk Band: {profile.get('risk_band')}
    - Decision: {dec.get('decision')}
    - Income Rhythm: {profile.get('income_rhythm')}/100
    - Bill Discipline: {profile.get('bill_discipline')}/100
    - Bounces: {profile.get('bounce_count')}
    - Edge Cases: {profile.get('edge_cases_detected')}

    REQUIRED OUTPUTS:
    1. [USER_HI]: 3-4 sentences in PURE Hindi (Devanagari). Explain the decision warmly to the gig worker.
    2. [USER_EN]: A semantically identical translation of [USER_HI] in warm, professional English.
    3. [LENDER]: 3 sentences in technical English for a credit manager (behavioral signals, risk mitigants, final audit note).

    Format your response EXACTLY as:
    USER_HI: <text>
    USER_EN: <text>
    LENDER: <text>"""

    try:
        from .llm_provider import llm
        
        # Use our new LLMProvider (Ollama -> Groq -> Gemini fallback)
        text, provider = await llm.chat(prompt=prompt, system_prompt="You are a warm financial assistant and a risk analyst.")
        print(f"Explanation generated using: {provider}")
        
        # Parse the custom format
        parts = {}
        for line in text.split('\n'):
            line = line.strip()
            if line.startswith('USER_HI:'): parts['user_explanation_hi'] = line.replace('USER_HI:', '').strip()
            if line.startswith('USER_EN:'): parts['user_explanation_en'] = line.replace('USER_EN:', '').strip()
            if line.startswith('LENDER:'): parts['lender_explanation'] = line.replace('LENDER:', '').strip()
            
        user_hi = parts.get('user_explanation_hi', "Aapka report taiyaar hai.")
        user_en = parts.get('user_explanation_en', "Your report is ready.")
        lender_exp = parts.get('lender_explanation', "Decision finalized based on behavioral telemetry.")
        
    except Exception as e:
        print(f"Explanation Agent Error: {e}")
        user_hi = "Aapka Bharosa score calculate ho gaya hai. System abhi busy hai, kripya baad mein check karein."
        user_en = "Your Bharosa score has been calculated. The system is currently busy, please check back later."
        lender_exp = "Fallback generated explanation due to LLM timeout."

    return AgentMessage("explanation_agent", "SUCCESS", {
        "user_explanation_hi": user_hi, 
        "user_explanation_en": user_en, 
        "lender_explanation": lender_exp
    }, processing_time_ms=int((time.time()-start)*1000), next_agent="report_agent")
