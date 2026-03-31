import pandas as pd
import numpy as np

EC1 = "EC1_SEASONAL_WORKER"
EC2 = "EC2_RAPID_BOUNCE_RECOVERY"
EC3 = "EC3_BORDERLINE_SCORE"
EC4 = "EC4_DATA_QUALITY_LOW"
EC5 = "EC5_OUT_OF_DOMAIN"
EC6 = "EC6_LLM_FAILURE"

def extract_features(df: pd.DataFrame) -> dict:
    features = {}
    
    # Pre-process
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date')
    
    # Income Rhythm (avg days between CREDIT/UPI_IN)
    income_txns = df[df['transaction_type'].isin(['CREDIT', 'UPI_IN'])]
    if len(income_txns) > 1:
        days_between = income_txns['date'].diff().dt.days.dropna()
        features['income_frequency_days'] = float(days_between.mean())
    else:
        features['income_frequency_days'] = 30.0 # Default fallback
        
    # Avg Monthly Income
    total_months = max(1, (df['date'].max() - df['date'].min()).days / 30)
    features['avg_monthly_income'] = float(income_txns['amount'].sum() / total_months)
    
    # Income Volatility Pct
    monthly_income = income_txns.groupby(income_txns['date'].dt.to_period('M'))['amount'].sum()
    if len(monthly_income) > 1:
        features['income_volatility_pct'] = float((monthly_income.std() / monthly_income.mean()) * 100)
    else:
        features['income_volatility_pct'] = 0.0

    # Bill Discipline
    bill_txns = df[df['transaction_type'] == 'BILL_PAYMENT']
    features['bill_payment_count'] = int(len(bill_txns))
    
    if len(bill_txns) > 0:
        on_time = bill_txns[bill_txns['date'].dt.day <= 7]
        features['bill_on_time_pct'] = float(len(on_time) / len(bill_txns))
    else:
        features['bill_on_time_pct'] = 0.0

    # Bounces & Recovery
    bounce_txns = df[df['transaction_type'] == 'BOUNCE']
    features['bounce_count'] = int(len(bounce_txns))
    
    recovery_days_list = []
    for idx, bounce in bounce_txns.iterrows():
        future_txns = df[(df['date'] > bounce['date']) & (df['balance_after'] > 0)]
        if not future_txns.empty:
            first_positive = future_txns.iloc[0]
            days = (first_positive['date'] - bounce['date']).days
            recovery_days_list.append(days)
        else:
            recovery_days_list.append(30) # Max 30
            
    if recovery_days_list:
        features['bounce_recovery_days'] = float(np.mean(recovery_days_list))
    else:
        features['bounce_recovery_days'] = 0.0
        
    # Savings
    months = df.groupby(df['date'].dt.to_period('M'))
    saving_months = 0
    for name, group in months:
        if group['balance_after'].iloc[-1] > group['balance_after'].iloc[0]:
            saving_months += 1
    
    features['saving_months_count'] = int(saving_months)
    features['avg_weekly_savings'] = float((df['balance_after'].iloc[-1] - df['balance_after'].iloc[0]) / (len(df) / 7))
    
    # Low balance
    features['low_balance_events'] = int(len(df[df['balance_after'] < 500]))
    
    # Platform payout
    features['platform_payout_count'] = int(len(df[(df['transaction_type'].isin(['UPI_IN', 'CREDIT'])) | (df['counterparty'].str.contains('Platform', na=False, case=False))]))
    
    # Edge Cases
    edge_cases = []
    if features['avg_monthly_income'] == 0:
        edge_cases.append(EC4)
    if features['bounce_count'] > 0 and features['bounce_recovery_days'] <= 2:
        edge_cases.append(EC2)
    if features['income_volatility_pct'] > 50 and features['income_frequency_days'] > 15:
        edge_cases.append(EC1)
        
    return features, edge_cases
