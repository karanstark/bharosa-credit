import time
from core.message import AgentMessage
from core.features import extract_features

async def run(data_msg: AgentMessage) -> AgentMessage:
    start = time.time()
    df = data_msg.data.get('clean_df')
    try:
        features, edge_cases = extract_features(df)
        status = "SUCCESS"
    except Exception as e:
        features = {}
        edge_cases = []
        status = "PARTIAL"
        
    proc_time = int((time.time() - start) * 1000)
    
    return AgentMessage(
        agent_name="feature_agent",
        status=status,
        data={
            "features": features, 
            "edge_case_flags": edge_cases,
            "metadata": data_msg.data.get("metadata", {})
        },
        processing_time_ms=proc_time,
        next_agent="scoring_agent"
    )
