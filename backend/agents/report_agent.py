import time
import uuid
from datetime import datetime
from core.message import AgentMessage

async def run(pipeline_log, all_results, start_time) -> AgentMessage:
    start = time.time()
    
    total_time = int((time.time() - start_time) * 1000)
    
    data_msg = all_results.get("data_agent", AgentMessage("data_agent","SUCCESS",{}))
    feat_msg = all_results.get("feature_agent", AgentMessage("feature_agent","SUCCESS",{}))
    score_msg = all_results.get("scoring_agent", AgentMessage("scoring_agent","SUCCESS",{}))
    comp_msg = all_results.get("compliance_agent", AgentMessage("compliance_agent","SUCCESS",{}))
    dec_msg = all_results.get("decision_agent", AgentMessage("decision_agent","SUCCESS",{}))
    exp_msg = all_results.get("explanation_agent", AgentMessage("explanation_agent","SUCCESS",{}))
    
    groq_calls = 1 if dec_msg.data.get('llm_used') == 'groq' else 0
    if comp_msg.data.get('borderline_review'):
        groq_calls += 1
        
    gemini_calls = 2 if exp_msg.status == 'SUCCESS' else 0
    if dec_msg.data.get('llm_used') == 'gemini':
        gemini_calls += 1

    # Resilience: Handle case where decision might be a string or malformed
    decision_data = dec_msg.data.get('decision', {})
    if isinstance(decision_data, str):
        decision_data = {"decision": decision_data, "loan_amount_recommended": 0}
    
    bharosa_decision = decision_data.get('decision', "")
    loan_amount = decision_data.get('loan_amount_recommended', 0)

    # Prepare edge case report as boolean flags for frontend (BEFORE usage)
    edge_cases_list = score_msg.data.get("bharosa_profile", {}).get("edge_cases_detected", [])
    edge_case_report = {ec: True for ec in edge_cases_list}

    report = {
        "report_id": str(uuid.uuid4()),
        "generated_at": datetime.now().isoformat(),
        "pipeline_summary": {
            "total_agents_run": 7,
            "total_processing_time_ms": total_time,
            "agents_status": {
                "data_agent": data_msg.status,
                "feature_agent": feat_msg.status,
                "scoring_agent": score_msg.status,
                "compliance_agent": comp_msg.status,
                "decision_agent": dec_msg.status,
                "explanation_agent": exp_msg.status,
                "report_agent": "SUCCESS"
            },
            "llm_routing": {
                "groq_calls": groq_calls,
                "gemini_calls": gemini_calls,
                "fallback_triggered": any("Gemini also failed" in str(w) for w in dec_msg.warnings)
            }
        },
        "data_quality": data_msg.data.get("data_quality_report", {}),
        "bharosa_profile": score_msg.data.get("bharosa_profile", {}),
        "edge_case_report": edge_case_report,
        "compliance": comp_msg.data.get("compliance_result", {}),
        "decision": decision_data,
        "explanations": exp_msg.data,
        "impact_metrics": {
            "traditional_decision": "REJECTED",
            "bharosa_decision": bharosa_decision,
            "improvement": "First access to formal credit",
            "estimated_loan_value": loan_amount,
            "workers_like_this": "45 Cr+"
        }
    }
    
    report = {
        "report_id": str(uuid.uuid4()),
        "generated_at": datetime.now().isoformat(),
        "pipeline_summary": {
            "total_agents_run": 7,
            "total_processing_time_ms": total_time,
            "agents_status": {
                "data_agent": data_msg.status,
                "feature_agent": feat_msg.status,
                "scoring_agent": score_msg.status,
                "compliance_agent": comp_msg.status,
                "decision_agent": dec_msg.status,
                "explanation_agent": exp_msg.status,
                "report_agent": "SUCCESS"
            },
            "llm_routing": {
                "groq_calls": groq_calls,
                "gemini_calls": gemini_calls,
                "fallback_triggered": "Gemini also failed" in dec_msg.warnings
            }
        },
        "data_quality": data_msg.data.get("data_quality_report", {}),
        "bharosa_profile": score_msg.data.get("bharosa_profile", {}),
        "edge_case_report": edge_case_report,
        "compliance": comp_msg.data.get("compliance_result", {}),
        "decision": dec_msg.data.get("decision", {}),
        "explanations": exp_msg.data,
        "impact_metrics": {
            "traditional_decision": "REJECTED",
            "bharosa_decision": dec_msg.data.get('decision', {}).get('decision', ""),
            "improvement": "First access to formal credit",
            "estimated_loan_value": dec_msg.data.get('decision', {}).get('loan_amount_recommended', 0),
            "workers_like_this": "45 Cr+"
        }
    }
    
    if 'llm_used' not in report['decision']:
        report['decision']['llm_used'] = dec_msg.data.get('llm_used')
        
    return AgentMessage("report_agent", "SUCCESS", {"report": report}, processing_time_ms=int((time.time() - start) * 1000))
