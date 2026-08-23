from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from schemas import ChatRequest, ChatResponse
from memory import MemoryManager
# from agent import JarvisAgent
from brain import Jarvis

app = FastAPI(title="J.A.R.V.I.S. Core", version="0.1.0")
app.mount("/static", StaticFiles(directory="static"), name="static")

memory_store = MemoryManager()
brain = Jarvis(model_name="openai/gpt-oss-120b")


@app.get("/")
async def root():
    return FileResponse("static/index.html")

@app.get("/style.css")
async def styles():
    return FileResponse("static/style.css")

@app.get("/app.js")
async def script():
    return FileResponse("static/app.js")

@app.get("/health")
async def health_check():
    return {"status": "Online", "memory_core": "Active"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # Step 1: Recall relevant context from vector store
        past_context = memory_store.recall_memory(
            user_id=request.user_id, 
            query=request.message
        )
        
        # Step 2: Temporary agent placeholder output
        bot_reply = brain.generate_response(
            query = request.message,
            context = past_context
        )
        # Step 3: Persist incoming message for future recall
        memory_store.store_memory(
            user_id=request.user_id, 
            text=request.message
        )

        return ChatResponse(
            user_id=request.user_id,
            response=bot_reply,
            context_retrieved=past_context
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))