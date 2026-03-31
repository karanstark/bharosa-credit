import asyncio
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import config
from agents.orchestrator import BharosaOrchestrator
import json

async def main():
    orch = BharosaOrchestrator()
    file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "sample_profiles", "good_profile.csv")
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return
    try:
        res = await orch.run(file_path, 25000)
        print(json.dumps(res, indent=2))
        print("Pipeline Test SUCCESS")
    except Exception as e:
        print("Pipeline Test FAILED:", str(e))

if __name__ == "__main__":
    asyncio.run(main())
