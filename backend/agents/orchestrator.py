import time
from core.message import AgentMessage
from agents import data_agent, feature_agent, scoring_agent, compliance_agent, decision_agent, explanation_agent, report_agent

class BharosaOrchestrator:
    def __init__(self):
        pass

    async def run(self, file_path_or_df, requested_amount=20000.0):
        pipeline_log = []
        all_results = {}
        start_time = time.time()
        
        # Step 1: Data Ingestion
        data_msg = await data_agent.run(file_path_or_df)
        all_results["data_agent"] = data_msg
        pipeline_log.append(data_msg)
        if data_msg.status == "FAILURE":
            return {"error": "Data could not be processed"}
        
        # Step 2: Feature Engineering
        feat_msg = await feature_agent.run(data_msg)
        all_results["feature_agent"] = feat_msg
        pipeline_log.append(feat_msg)
        
        # Step 3: Scoring Model
        score_msg = await scoring_agent.run(feat_msg)
        all_results["scoring_agent"] = score_msg
        pipeline_log.append(score_msg)
        
        # Step 4: RBI Compliance Guardrail
        comp_msg = await compliance_agent.run(score_msg, requested_amount)
        all_results["compliance_agent"] = comp_msg
        pipeline_log.append(comp_msg)
        if comp_msg.data.get("borderline_review"):
            print("Orchestrator: Borderline RBI compliance detected - parallel LLM analysis triggered.")
            
        # Step 5: Decision Agent (Async LLM)
        dec_msg = await decision_agent.run(score_msg, comp_msg)
        all_results["decision_agent"] = dec_msg
        pipeline_log.append(dec_msg)
        
        # Step 6: Explanation Agent (Async LLM)
        exp_msg = await explanation_agent.run(score_msg, dec_msg)
        all_results["explanation_agent"] = exp_msg
        pipeline_log.append(exp_msg)
        
        # Step 7: Final Report Synthesis
        rep_msg = await report_agent.run(pipeline_log, all_results, start_time)
        all_results["report_agent"] = rep_msg
        pipeline_log.append(rep_msg)
        
        return rep_msg.data.get("report")
