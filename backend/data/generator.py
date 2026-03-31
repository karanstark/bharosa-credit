import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def generate_csv(filename, profile_type):
    # Base configuration
    num_days = 180
    start_date = datetime.now() - timedelta(days=num_days)
    dates = [start_date + timedelta(days=i) for i in range(num_days)]
    
    data = []
    balance = 0
    
    # Profile specific settings
    if profile_type == 'good':
        income_interval = 7
        income_base = 10000
        volatility = 0.15
        bounce_chance = 0.0
        bill_delay = 0
        savings_prob = 0.8
        recovery_days = 2
    elif profile_type == 'medium':
        income_interval = 12
        income_base = 8000
        volatility = 0.35
        bounce_chance = 0.02
        bill_delay = 5
        savings_prob = 0.5
        recovery_days = 8
    elif profile_type == 'poor':
        income_interval = 20
        income_base = 5000
        volatility = 0.60
        bounce_chance = 0.05
        bill_delay = 15
        savings_prob = 0.2
        recovery_days = 15
    else: # edge
        income_interval = 10
        income_base = 9000
        volatility = 0.50
        bounce_chance = 0.0
        bill_delay = 0
        savings_prob = 0.1
        recovery_days = 2

    # Track bounces for edge profile
    edge_bounces_added = 0

    for d in dates:
        txn_type = None
        amount = 0
        counterparty = ""
        category = ""
        
        # Seasonal income logic for edge profile
        current_income_base = income_base
        if profile_type == 'edge':
            month = d.month
            if month in [4, 5, 6, 10, 11, 12]:
                current_income_base = 12000 # Heavy income
            else:
                current_income_base = 3000  # Very low income

        # Determine events for the day
        if d.toordinal() % income_interval == 0:
            txn_type = "CREDIT"
            amount = np.random.normal(current_income_base, current_income_base * volatility)
            amount = max(100, int(amount))
            counterparty = "Platform Inc" if np.random.rand() > 0.5 else "Customer Transfer"
            category = "SALARY"
            balance += amount
            data.append([d.strftime('%Y-%m-%d'), txn_type, amount, counterparty, category, balance])
            
            # For edge profile, add recovered bounces
            if profile_type == 'edge' and edge_bounces_added < 2 and current_income_base == 3000:
                # Add a bounce next day
                bounce_date = d + timedelta(days=1)
                data.append([bounce_date.strftime('%Y-%m-%d'), "BOUNCE", 500, "Bank Fees", "FEE", balance - 500])
                # Add recovery day after
                recovery_date = d + timedelta(days=3)
                data.append([recovery_date.strftime('%Y-%m-%d'), "CREDIT", 500, "Customer Transfer", "SALARY", balance])
                edge_bounces_added += 1
            
            continue
            
        if np.random.rand() < 0.05:
            txn_type = "DEBIT"
            amount = int(np.random.uniform(50, 500))
            counterparty = "Grocery Store"
            category = "EXPENSE"
            balance -= amount
            data.append([d.strftime('%Y-%m-%d'), txn_type, amount, counterparty, category, balance])
            continue
            
        if np.random.rand() < bounce_chance:
            txn_type = "BOUNCE"
            amount = int(np.random.uniform(100, 1000))
            counterparty = "Bank Fees"
            category = "FEE"
            balance -= amount
            data.append([d.strftime('%Y-%m-%d'), txn_type, amount, counterparty, category, balance])
            continue

    df = pd.DataFrame(data, columns=['date', 'transaction_type', 'amount', 'counterparty', 'category', 'balance_after'])
    
    # Sort by date just in case we appended future dates
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date')
    df['date'] = df['date'].dt.strftime('%Y-%m-%d')
    
    # Save to file
    out_dir = os.path.join(os.path.dirname(__file__), 'sample_profiles')
    os.makedirs(out_dir, exist_ok=True)
    file_path = os.path.join(out_dir, filename)
    df.to_csv(file_path, index=False)
    print(f"Generated {file_path}")

if __name__ == "__main__":
    generate_csv('good_profile.csv', 'good')
    generate_csv('medium_profile.csv', 'medium')
    generate_csv('poor_profile.csv', 'poor')
    generate_csv('edge_profile.csv', 'edge')
