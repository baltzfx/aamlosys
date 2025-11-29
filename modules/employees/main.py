from fastapi import FastAPI
from core.db import Base, engine
from routes import employees


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(employees.router, prefix="/employees")
