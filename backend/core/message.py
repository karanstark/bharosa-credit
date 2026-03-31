from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional

@dataclass
class AgentMessage:
    agent_name: str
    status: str
    data: Dict[str, Any]
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    timestamp: str = ""
    processing_time_ms: int = 0
    next_agent: Optional[str] = None
