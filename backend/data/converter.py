import pandas as pd
import os

def convert_dataset():
    input_path = r"c:\Users\HP\Downloads\bharosa credit\UPI transaction dataset\MyTransaction.csv"
    print(f"Reading from {input_path}")
    df = pd.read_csv(input_path)
    
    cols = df.columns
    date_col = cols[0]
    cat_col = cols[1]
    ref_col = cols[2]
    with_col = cols[4]
    dep_col = cols[5]
    bal_col = cols[6]
    
    df = df.dropna(subset=[date_col, bal_col])
    
    new_data = []
    for _, row in df.iterrows():
        try:
            # Handle varying date formats
            d = pd.to_datetime(row[date_col], format='mixed', dayfirst=True).strftime('%Y-%m-%d')
        except:
            continue
            
        # Parse numeric columns safely
        try:
            w = float(str(row[with_col]).replace(',', '')) if pd.notna(row[with_col]) else 0.0
        except ValueError:
            w = 0.0
            
        try:
            dep = float(str(row[dep_col]).replace(',', '')) if pd.notna(row[dep_col]) else 0.0
        except ValueError:
            dep = 0.0
            
        amt = w if w > 0 else (dep if dep > 0 else 0.0)
        
        # Transaction Type Mapping
        if dep > 0:
            if str(row[cat_col]).lower() == 'salary':
                ttype = 'SALARY'
            else:
                ttype = 'UPI_IN'
        else:
            if str(row[cat_col]).lower() == 'rent':
                ttype = 'BILL_PAYMENT'
            else:
                ttype = 'UPI_OUT'
                
        cp = str(row[ref_col]) if pd.notna(row[ref_col]) else "Unknown"
        cat = str(row[cat_col]) if pd.notna(row[cat_col]) else "MISC"
        
        try:
            bal = float(str(row[bal_col]).replace(',', '')) if pd.notna(row[bal_col]) else 0.0
        except ValueError:
            bal = 0.0
        
        new_data.append({
            'date': d,
            'transaction_type': ttype,
            'amount': amt,
            'counterparty': cp,
            'category': cat.upper(),
            'balance_after': bal
        })
        
    out_df = pd.DataFrame(new_data)
    out_dir = r"c:\Users\HP\Downloads\bharosa credit\bharosa-credit\backend\data\sample_profiles"
    os.makedirs(out_dir, exist_ok=True)
    
    out_df.to_csv(os.path.join(out_dir, 'good_profile.csv'), index=False)
    
    # Create synthetic variations for medium and poor to work with the UI flow
    medium_df = out_df.copy()
    medium_df['amount'] = medium_df['amount'] * 0.7
    medium_df['balance_after'] = medium_df['balance_after'] * 0.7
    # Add a few bounces
    medium_df.loc[medium_df.index % 40 == 0, 'transaction_type'] = 'BOUNCE'
    medium_df.to_csv(os.path.join(out_dir, 'medium_profile.csv'), index=False)
    
    poor_df = out_df.copy()
    poor_df.loc[poor_df.index % 15 == 0, 'transaction_type'] = 'BOUNCE'
    poor_df['amount'] = poor_df['amount'] * 0.3
    poor_df['balance_after'] = poor_df['balance_after'] * 0.3
    poor_df.to_csv(os.path.join(out_dir, 'poor_profile.csv'), index=False)
    print("Successfully mapped MyTransaction.csv to good, medium, and poor profiles.")

if __name__ == "__main__":
    convert_dataset()
