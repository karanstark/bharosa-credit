import time
from core.message import AgentMessage
from core.scorer import calculate_score

async def run(feat_msg: AgentMessage) -> AgentMessage:
    start = time.time()
    features = feat_msg.data.get('features', {})
    edge_cases = feat_msg.data.get('edge_case_flags', [])
    
    profile = calculate_score(features, edge_cases)
    proc_time = int((time.time() - start) * 1000)
    
    return AgentMessage(
        agent_name="scoring_agent",
        status="SUCCESS",
        data={"bharosa_profile": profile},
        processing_time_ms=proc_time,
        next_agent="compliance_agent"
    )
