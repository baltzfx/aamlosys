from fastapi import FastAPI
from routes import upload

app = FastAPI()

# Register Routes
app.include_router(upload.router)
