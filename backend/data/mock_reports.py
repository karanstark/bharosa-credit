# Mock Pre-computed Reports for 7-Agent Pipeline
# Ensures "Instant" response for demo profiles

MOCK_REPORTS = {
    "good": {
        "bharosa_score": 88,
        "feature_report": {
            "monthly_income": 45000.0,
            "saving_streak": 120,
            "bill_discipline": 98.5,
            "upi_bounces": 0
        },
        "compliance_report": {
            "rbi_status": "COMPLIANT",
            "aml_check": "PASSED",
            "fraud_signals": 0
        },
        "decision_report": {
            "decision": "APPROVED",
            "confidence": 0.96,
            "limit_offered": 50000.0,
            "llm_used": "groq"
        },
        "explanation_report": {
            "user_explanation_hi": "आपका आय और पुनर्भुगतान अनुशासन बहुत मजबूत है। बिना किसी क्रेडिट इतिहास के भी आपका स्कोरिंग ढांचा काफी ऊंचा है।",
            "user_explanation_en": "Your income and repayment discipline are exceptionally strong. Even without a traditional credit history, your scoring profile remains very high.",
            "lender_explanation": "Institutional-grade stability. No-prime history mitigated by high savings streak and perfect bill rhythm."
        },
        "edge_case_report": {
            "EC1": False,
            "EC2": False,
            "EC3": False,
            "EC4": False,
            "EC5": False,
            "EC6": False
        },
        "pipeline_summary": {
            "total_processing_time_ms": 142
        }
    },
    "medium": {
        "bharosa_score": 58,
        "feature_report": {
            "monthly_income": 22000.0,
            "saving_streak": 14,
            "bill_discipline": 72.0,
            "upi_bounces": 3
        },
        "compliance_report": {
            "rbi_status": "COMPLIANT",
            "aml_check": "PASSED",
            "fraud_signals": 1
        },
        "decision_report": {
            "decision": "APPROVED",
            "confidence": 0.72,
            "limit_offered": 15000.0,
            "llm_used": "gemini"
        },
        "explanation_report": {
            "user_explanation_hi": "हाल के UPI बाउंस के कारण आपका स्कोरकार्ड बॉर्डरलाइन पर है। आपके व्यवहार की निगरानी के लिए लिमिट थोड़ी कम रखी गई है।",
            "user_explanation_en": "Your scorecard is at a borderline level due to recent UPI bounces. The credit limit has been intentionally kept conservative to monitor your repayment behavior.",
            "lender_explanation": "Credit volatility alert: Recent UPI bounces impacting PD. Recommended limit reduction for behavioral monitoring."
        },
        "edge_case_report": {
            "EC1": False,
            "EC2": False,
            "EC3": True,
            "EC4": False,
            "EC5": False,
            "EC6": False
        },
        "pipeline_summary": {
            "total_processing_time_ms": 284
        }
    },
    "edge": {
        "bharosa_score": 76,
        "feature_report": {
            "monthly_income": 31000.0,
            "saving_streak": 45,
            "bill_discipline": 88.0,
            "upi_bounces": 2
        },
        "compliance_report": {
            "rbi_status": "COMPLIANT",
            "aml_check": "PASSED",
            "fraud_signals": 0
        },
        "decision_report": {
            "decision": "APPROVED",
            "confidence": 0.89,
            "limit_offered": 30000.0,
            "llm_used": "groq"
        },
        "explanation_report": {
            "user_explanation_hi": "मौसमी अंतराल (EC1) का पता चला है, पर आपने बाउंस को जल्दी रिकवर किया है (EC2)। हमारा स्वायत्त इंजन आपकी अनुकूलन क्षमता को पहचानता है।",
            "user_explanation_en": "Seasonal income gaps (EC1) were detected, but you successfully recovered from bounces quickly (EC2). Our autonomous engine recognizes your strong financial adaptability.",
            "lender_explanation": "Active EC1/EC2 normalization. Seasonal dip identified as macro-trend, not behavioral failure. Strong recovery signals detected."
        },
        "edge_case_report": {
            "EC1": True,
            "EC2": True,
            "EC3": False,
            "EC4": True,
            "EC5": False,
            "EC6": False
        },
        "pipeline_summary": {
            "total_processing_time_ms": 198
        }
    },
    "poor": {
        "bharosa_score": 32,
        "feature_report": {
            "monthly_income": 12000.0,
            "saving_streak": 2,
            "bill_discipline": 45.0,
            "upi_bounces": 8
        },
        "compliance_report": {
            "rbi_status": "HIGH RISK",
            "aml_check": "PASSED",
            "fraud_signals": 3
        },
        "decision_report": {
            "decision": "REJECT",
            "confidence": 0.94,
            "limit_offered": 0.0,
            "llm_used": "groq"
        },
        "explanation_report": {
            "user_explanation_hi": "क्षमा करें, कई UPI बाउंस और अनियमित आय प्रवाह के कारण हम अभी क्रेडिट ऑफर नहीं कर सकते हैं।",
            "user_explanation_en": "We're sorry, but due to multiple UPI bounces and irregular income flow, we are unable to offer credit at this time.",
            "lender_explanation": "Policy Reject: Cumulative fraud signals and systemic UPI failure breach Basel-III safety protocols."
        },
        "edge_case_report": {
            "EC1": False,
            "EC2": False,
            "EC3": False,
            "EC4": False,
            "EC5": False,
            "EC6": False
        },
        "pipeline_summary": {
            "total_processing_time_ms": 110
        }
    }
}
