from pydantic import BaseModel
from typing import List, Optional, Dict

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict]] = []
    session_id: Optional[str] = None
    use_history: Optional[bool] = False