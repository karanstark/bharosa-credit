import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_sample_edge():
    print(f"Testing {BASE_URL}/analyze/sample/edge...")
    try:
        response = requests.post(f"{BASE_URL}/analyze/sample/edge")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print("Successfully received report.")
            # print(json.dumps(data, indent=2))
            
            # Check for keys used in Dashboard.tsx and Insights.tsx
            required_keys = ['bharosa_profile', 'decision', 'explanations', 'edge_case_report']
            for key in required_keys:
                if key in data:
                    print(f"  [OK] Key '{key}' present.")
                else:
                    print(f"  [FAIL] Key '{key}' MISSING.")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    test_sample_edge()
