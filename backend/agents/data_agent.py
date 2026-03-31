import pandas as pd
import time
from core.message import AgentMessage

async def run(file_path_or_df) -> AgentMessage:
    start_time = time.time()
    errors = []
    warnings = []
    status = "SUCCESS"
    clean_df = pd.DataFrame()
    data_quality_report = {}
    
    try:
        if isinstance(file_path_or_df, str):
            # It's a file path
            df = pd.read_csv(file_path_or_df)
        elif isinstance(file_path_or_df, dict):
            # It's direct JSON data from an API (API Setu / AA)
            # Support both {'transactions': [...]} and direct lists
            txns = file_path_or_df.get("transactions")
            if txns is None:
                # Fallback to the whole dict if it's actually a list or a list-like dict
                txns = file_path_or_df.get("data", []) if "data" in file_path_or_df else []
            
            df = pd.DataFrame(txns)
        else:
            # It's already a DataFrame
            df = file_path_or_df
            
        if df is None or df.empty:
            return AgentMessage(
                agent_name="data_agent",
                status="FAILURE",
                data={},
                errors=["Input data is empty or malformed"],
                warnings=[],
                processing_time_ms=0,
                next_agent=None
            )
            
        # Ensure we have a clean copy to avoid SettingWithCopyWarning
        df = df.copy()

        # Check C: Hindi/regional column names mapping
        column_map = {
            "दिनांक": "date",
            "राशि": "amount",
            "शेष": "balance_after",
            "प्रकार": "transaction_type",
            "विवरण": "counterparty"
        }
        df = df.rename(columns=column_map)
        
        # Check D: Keep relevant columns only
        keep = [c for c in df.columns if c in ['date','transaction_type','amount','counterparty','category','balance_after']]
        if keep:
            df = df[keep]

        # Check E: Completely unreadable check
        required = ['date', 'amount']
        missing = [c for c in required if c not in df.columns]
        if len(missing) == 2:
            return AgentMessage(
                agent_name="data_agent",
                status="FAILURE",
                data={},
                errors=["Data has no 'date' or 'amount' columns"],
                warnings=[],
                processing_time_ms=0,
                next_agent=None
            )

        # Check A: Non-numeric amounts cleanup
        if 'amount' in df.columns:
            df['amount'] = pd.to_numeric(
                df['amount'].astype(str).str.replace(r'[₹,Rs\s]', '', regex=True), 
                errors='coerce'
            ).fillna(0)

        # Check B: Robust date parsing
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(
                df['date'],
                format='mixed',
                errors='coerce',
                dayfirst=True
            )
            invalid = df['date'].isna().sum()
            df = df.dropna(subset=['date'])
            if invalid > 0:
                warnings.append(f"{invalid} invalid dates discarded")

        total_rows = len(df)
        
        # Ensure all columns exist for downstream agents
        req_cols = ['date', 'transaction_type', 'amount', 'counterparty', 'category', 'balance_after']
        for col in req_cols:
            if col not in df.columns:
                df[col] = 0 if col in ['amount', 'balance_after'] else "UNKNOWN"
                warnings.append(f"Auto-filled missing column: {col}")
                status = "PARTIAL"
        
        # Fix Internal Anomalies
        anomalies = 0
        anomaly_details = []
        
        # 1. Null Amounts
        if df['amount'].isna().any():
            count = df['amount'].isna().sum()
            anomalies += count
            df['amount'] = df['amount'].fillna(0)
            anomaly_details.append(f"Filled {count} empty amounts with 0.")
            status = "PARTIAL"
            
        # 2. Negative Amounts
        neg_mask = df['amount'] < 0
        if neg_mask.any():
            count = neg_mask.sum()
            anomalies += count
            df.loc[neg_mask, 'amount'] = df.loc[neg_mask, 'amount'].abs()
            anomaly_details.append(f"Converted {count} negative amounts to positive.")
            
        # future dates
        now = pd.Timestamp.now()
        future = df[df['date'] > now]
        if not future.empty:
            anomalies += len(future)
            df = df[df['date'] <= now]
            anomaly_details.append("Removed future dates silently.")
            
        df = df.drop_duplicates()
        cleaned_rows = len(df)
        
        confidence = "HIGH" if anomalies < (total_rows * 0.1) else ("MEDIUM" if anomalies < (total_rows * 0.3) else "LOW")
        
        data_quality_report = {
            "total_rows": total_rows,
            "cleaned_rows": cleaned_rows,
            "anomalies_found": anomalies,
            "anomaly_details": anomaly_details,
            "data_confidence": confidence
        }
        clean_df = df
        
    except Exception as e:
        errors.append(str(e))
        status = "PARTIAL"
        
    proc_time = int((time.time() - start_time) * 1000)
    
    return AgentMessage(
        agent_name="data_agent",
        status=status,
        data={"clean_df": clean_df, "data_quality_report": data_quality_report},
        errors=errors,
        warnings=warnings,
        processing_time_ms=proc_time,
        next_agent="feature_agent"
    )
