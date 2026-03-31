from config import FEATURE_WEIGHTS, RISK_BANDS, RBI_MIN_SCORE

EC1 = "EC1_SEASONAL_WORKER"
EC2 = "EC2_RAPID_BOUNCE_RECOVERY"
EC3 = "EC3_BORDERLINE_SCORE"
EC4 = "EC4_DATA_QUALITY_LOW"
EC5 = "EC5_OUT_OF_DOMAIN"
EC6 = "EC6_LLM_FAILURE"

def calculate_score(features: dict, edge_cases: list, metadata: dict = None) -> dict:
    profile = {}
    metadata = metadata or {}
    
    # 1. Capture user-provided metrics from metadata if available
    user_cibil = metadata.get('cibil')
    user_goal = metadata.get('goal', 'General Prosperity')
    
    profile['user_cibil'] = user_cibil
    profile['selected_goal'] = user_goal
    
    # Income Rhythm
    freq = features.get('income_frequency_days', 30)
    if freq <= 7:
        ir_score = 100
    elif freq >= 30:
        ir_score = 0
    else:
        ir_score = 100 - ((freq - 7) * (100 / 23))
        
    if EC1 in edge_cases:
        ir_score = min(100, ir_score * 1.2)
    profile['income_rhythm'] = int(max(0, ir_score))
    
    # Bill Discipline
    bd_base = features.get('bill_on_time_pct', 0) * 100
    bounce_penalty_val = 15
    if EC2 in edge_cases:
        bounce_penalty_val = 7.5
        
    bd_score = bd_base - (features.get('bounce_count', 0) * bounce_penalty_val)
    profile['bill_discipline'] = int(max(0, bd_score))
    
    # Recovery Score
    if features.get('bounce_count', 0) == 0:
        rec_score = 100
    else:
        rec_days = features.get('bounce_recovery_days', 30)
        if rec_days <= 3:
            rec_score = 100
        elif rec_days >= 30:
            rec_score = 0
        else:
            rec_score = 100 - ((rec_days - 3) * (100 / 27))
    profile['recovery_score'] = int(max(0, rec_score))
    
    # Volatility
    vol = features.get('income_volatility_pct', 0)
    if vol < 10:
        vol_score = 100
    elif vol > 60:
        vol_score = 0
    else:
        vol_score = 100 - ((vol - 10) * 2)
    profile['volatility_score'] = int(max(0, vol_score))
    
    # Saving Streak
    sav_months = features.get('saving_months_count', 0)
    profile['saving_streak'] = int((sav_months / 6.0) * 100)
    
    # Bounce Penalty Score
    bp_deduction = 15
    if EC2 in edge_cases:
        bp_deduction = 8
        
    bp_score = 100 - (features.get('bounce_count', 0) * bp_deduction)
    profile['bounce_penalty'] = int(max(0, bp_score))
    
    # Final Score
    final_score = (
        profile['income_rhythm'] * FEATURE_WEIGHTS['income_rhythm'] +
        profile['bill_discipline'] * FEATURE_WEIGHTS['bill_discipline'] +
        profile['recovery_score'] * FEATURE_WEIGHTS['recovery_score'] +
        profile['volatility_score'] * FEATURE_WEIGHTS['volatility_score'] +
        profile['saving_streak'] * FEATURE_WEIGHTS['saving_streak'] +
        profile['bounce_penalty'] * FEATURE_WEIGHTS['bounce_penalty']
    )
    
    profile['bharosa_score'] = int(max(0, min(100, round(final_score))))
    
    # Risk Band
    score = profile['bharosa_score']
    band = "HIGH"
    for k, (low, high) in RISK_BANDS.items():
        if low <= score <= high:
            band = k
            break
    profile['risk_band'] = band
    
    profile['is_borderline'] = (40 <= score <= 50)
    
    # Confidence
    if features.get('bounce_count', 0) > 3 or features.get('income_volatility_pct', 0) > 50:
        profile['score_confidence'] = "LOW"
    elif EC1 in edge_cases:
        profile['score_confidence'] = "MEDIUM"
    else:
        profile['score_confidence'] = "HIGH"
        
    profile['edge_cases_detected'] = edge_cases
    profile['avg_monthly_income'] = features.get('avg_monthly_income', 0)
    profile['bounce_count'] = features.get('bounce_count', 0)
    
    return profile
