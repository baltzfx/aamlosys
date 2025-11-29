from fastapi import FastAPI
from core.db import Base, engine
from routes import auth, admin, users, logs


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router, prefix="/auth")
app.include_router(admin.router, prefix="/admin")
app.include_router(users.router, prefix="/user")
app.include_router(logs.router, prefix="/admin")
