import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_KEY_FALLBACK = os.getenv("GROQ_API_KEY_FALLBACK")

FEATURE_WEIGHTS = {
  "income_rhythm": 0.25,
  "bill_discipline": 0.20,
  "recovery_score": 0.20,
  "volatility_score": 0.15,
  "saving_streak": 0.10,
  "bounce_penalty": 0.10
}

RISK_BANDS = {
  "LOW": (70, 100),
  "MEDIUM": (45, 69),
  "BORDERLINE": (40, 44),
  "HIGH": (0, 39)
}

LOAN_BANDS = {
  "LOW": {
    "eligible": True,
    "max_amount": 50000,
    "interest_rate": "12-14%"
  },
  "MEDIUM": {
    "eligible": True,
    "max_amount": 20000,
    "interest_rate": "16-20%"
  },
  "BORDERLINE": {
    "eligible": "CONDITIONAL",
    "max_amount": 10000,
    "interest_rate": "20-24%"
  },
  "HIGH": {
    "eligible": False,
    "max_amount": 0,
    "interest_rate": "N/A"
  }
}

RBI_MIN_SCORE = 40
RBI_MAX_LOAN_MULTIPLIER = 3
RBI_BOUNCE_DISQUALIFIER = 5
