from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Provide a clearer error if required dependencies are missing (e.g. SQLAlchemy)
try:
	from core.db import Base, engine
except ModuleNotFoundError as e:
	raise RuntimeError(
		"Missing required Python packages for the audit module.\n"
		"Install them with: `python -m pip install -r requirements.txt` in `modules/audit`"
	) from e

from routes import auth, admin, logs, employees, profile, users, branches, departments, inventory_items


Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(admin.router, prefix="/admin")
app.include_router(logs.router, prefix="/admin")
app.include_router(profile.router, prefix="/profile")
app.include_router(users.router, prefix="/users")
app.include_router(employees.router, prefix="/employees")
app.include_router(branches.router, prefix="/branches")
app.include_router(departments.router, prefix="/departments")
app.include_router(inventory_items.router, prefix="/inventory")