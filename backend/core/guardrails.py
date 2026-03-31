from config import RBI_MIN_SCORE, RBI_MAX_LOAN_MULTIPLIER, RBI_BOUNCE_DISQUALIFIER

DOMAIN_SCOPE = [
  "credit_scoring",
  "loan_eligibility",
  "financial_behavior",
  "upi_transaction_analysis",
  "rbi_compliance"
]

OUT_OF_SCOPE_DOMAINS = [
  "medical_coding",
  "supply_chain",
  "agriculture",
  "legal_advice",
  "insurance_underwriting"
]

def check_domain_scope(request_type):
  if not request_type:
    return {"in_scope": True}
  
  request_lower = request_type.lower()
  
  if request_lower in OUT_OF_SCOPE_DOMAINS:
    return {
      "in_scope": False,
      "action": "ESCALATE",
      "reason": f"{request_type} is outside BharosaCredit domain",
      "audit_entry": f"EC5 OUT_OF_DOMAIN: {request_type} detected — escalated to human specialist. No LLM call made."
    }
  
  if len(request_lower) < 3:
    return {
      "in_scope": False,
      "action": "ESCALATE",
      "reason": "Unrecognized domain input",
      "audit_entry": "EC5: Unknown domain — defaulting to escalation for safety"
    }
  
  return {"in_scope": True}

def check_minimum_score(score: int) -> bool:
    return score >= RBI_MIN_SCORE

def check_loan_amount(amount: float, income: float) -> bool:
    return amount <= (income * RBI_MAX_LOAN_MULTIPLIER)

def check_bounce_disqualifier(bounces: int) -> bool:
    return bounces < RBI_BOUNCE_DISQUALIFIER

def check_data_confidence(confidence: str) -> bool:
    # WARN, not fail
    return confidence != "LOW"

def run_all_checks(score: int, income: float, bounces: int, amount: float, **kwargs) -> dict:
    domain_result = check_domain_scope(kwargs.get("request_type", None))
    if not domain_result["in_scope"]:
      return {
        "passed": False,
        "failed_checks": ["DOMAIN_BOUNDARY"],
        "warnings": [],
        "compliance_note": domain_result["audit_entry"],
        "requires_deeper_review": False,
        "domain_check": domain_result,
        "escalated": True
      }
    
    failed_checks = []
    warnings = []
    
    if not check_minimum_score(score):
        failed_checks.append("RBI_MIN_SCORE_FAILED")
        
    if not check_loan_amount(amount, income):
        failed_checks.append("RBI_MAX_LOAN_EXCEEDED")
        
    if not check_bounce_disqualifier(bounces):
        failed_checks.append("RBI_BOUNCE_DISQUALIFIER_FAILED")
        
    passed = len(failed_checks) == 0
    compliance_note = "All RBI checks passed." if passed else "RBI compliance failed."
    
    return {
        "passed": passed,
        "failed_checks": failed_checks,
        "warnings": warnings,
        "compliance_note": compliance_note,
        "requires_deeper_review": False
    }
