# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from pyston import PystonClient

# app = FastAPI()
# piston = PystonClient()

# class CodeExecution(BaseModel):
#     language: str
#     code: str
#     stdin: str = ""

# @app.get("/languages")
# async def get_languages():
#     try:
#         runtimes = await piston.runtimes()
#         languages = [{"language": runtime.language, "version": runtime.version} for runtime in runtimes]
#         return {"languages": languages}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to fetch languages: {str(e)}")

# @app.post("/execute")
# async def execute_code(execution: CodeExecution):
#     try:
#         result = await piston.execute(language=execution.language, 
#                                       source=execution.code,
#                                       stdin=execution.stdin)
        
#         return {
#             "output": result.output,
#             "stderr": result.stderr,
#             "output_type": result.output_type,
#             "execution_time": result.execution_time,
#             "compile_output": result.compile_output,
#             "language": result.language,
#             "version": result.version
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Code execution failed: {str(e)}")

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)

# # poetry run uvicorn main:app --reload