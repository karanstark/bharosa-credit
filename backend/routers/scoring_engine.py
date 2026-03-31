import pandas as pd
import numpy as np
import os

# Path to the dataset
TRAIN_DATA_PATH = r"c:\Users\HP\Downloads\bharosa credit\credit dataset\train.csv"

class BharosaScoringEngine:
    def __init__(self):
        self.is_trained = False
        self.model_stats = {}

    def load_baseline(self):
        """Loads baseline statistics from the 31MB dataset for relative scoring."""
        if not os.path.exists(TRAIN_DATA_PATH):
            print(f"Dataset not found at {TRAIN_DATA_PATH}")
            return

        try:
            # We only read a sample to keep it fast for now
            df = pd.read_csv(TRAIN_DATA_PATH, nrows=5000)
            
            # Clean Credit_Score
            df['Credit_Score'] = df['Credit_Score'].map({'Good': 3, 'Standard': 2, 'Poor': 1})
            
            # Simple heuristic correlations
            self.model_stats = {
                "avg_income": df['Annual_Income'].mean(),
                "avg_debt": pd.to_numeric(df['Outstanding_Debt'].replace('_', '0'), errors='coerce').mean(),
                "avg_utilization": df['Credit_Utilization_Ratio'].mean(),
            }
            self.is_trained = True
            print("Bharosa Scoring Engine: Baseline loaded.")
        except Exception as e:
            print(f"Error loading baseline: {e}")

    def calculate_score(self, user_profile: dict) -> int:
        """
        Calculates a Bharosa Score based on user profile.
        If live data is missing, it uses provided parameters.
        Returns score between 300 and 900.
        """
        # Baseline score
        score = 600

        # Heuristic Logic
        # 1. Income impact
        income = user_profile.get("annual_income", 50000)
        if income > 100000: score += 50
        elif income < 20000: score -= 50

        # 2. Debt impact
        debt = user_profile.get("outstanding_debt", 0)
        if debt == 0: score += 100
        elif debt > 50000: score -= 100

        # 3. Delay impact
        delays = user_profile.get("delayed_payments", 0)
        score -= (delays * 30)

        # 4. Bank account diversity
        accounts = user_profile.get("num_bank_accounts", 1)
        if 1 <= accounts <= 3: score += 20
        elif accounts > 5: score -= 20

        # Clamp results
        return int(max(300, min(900, score)))

# Note: Using integer return for score
def get_score(user_profile: dict) -> int:
    engine = BharosaScoringEngine()
    # For now, we use the fast heuristic. 
    # In a full run, we'd call load_baseline()
    return engine.calculate_score(user_profile)
