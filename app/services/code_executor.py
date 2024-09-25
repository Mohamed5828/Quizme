# app/services/code_executor.py
import requests
import logging
from app.config import PISTON_URL

class CodeExecutor:
    def execute_code(self, language, code, stdin):
        """Execute code using Piston API and return the result."""
        payload = {
            "language": language,
            "source": code,
            "stdin": stdin
        }
        response = requests.post(f"{PISTON_URL}/execute", json=payload)

        if response.status_code == 200:
            result = response.json()
            
            # Check for timeout or memory limit exceeded
            if "timeout" in result.get("stderr", "").lower():
                return {"error": "Time limit exceeded"}
            elif "memory limit exceeded" in result.get("stderr", "").lower():
                return {"error": "Memory limit exceeded"}
            
            return result
        else:
            return {"error": "Code execution failed", "details": response.text}
