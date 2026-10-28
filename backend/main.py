from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI Mech Lab API",
    description="Backend for AI-powered learning pathways and project building.",
    version="0.1.0",
)

# Allow the React frontend to communicate with the backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Welcome to AI Mech Lab API!",
        "status": "running",
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AI Mech Lab API",
  }
