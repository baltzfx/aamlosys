from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.auth import require_session, require_admin
from core.db import get_db
from models.users import User
from schemas.user import UserCreate, UserRead, UpdateStatus, AdminResetPassword
from core.util import hash_password
from core.logger import log_action


router = APIRouter()

# ----------------------------------------
# ADMIN PANEL
# ----------------------------------------
@router.get("/panel")
def admin_panel(user = Depends(require_session)):
    require_admin(user)
    return {"message": f"Welcome admin {user.username}"}


# ----------------------------------------
# LIST ALL USERS (ADMIN ONLY)
# ----------------------------------------
@router.get("/users")
def list_users(
    page: int = 1,
    limit: int = 10,
    search: str = None,
    role: str = None,
    user = Depends(require_session),
    db: Session = Depends(get_db)
):
    require_admin(user)

    query = db.query(User)

    # Filtering
    if search:
        query = query.filter(
            (User.username.contains(search)) | 
            (User.email.contains(search))
        )
    if role:
        query = query.filter(User.role == role)

    total = query.count()

    # Pagination
    users = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "results": users
    }



# ----------------------------------------
# CREATE USER (ADMIN ONLY)
# ----------------------------------------
@router.post("/users", response_model=UserRead)
def admin_create_user(
    data: UserCreate,
    user = Depends(require_session),
    db: Session = Depends(get_db)
):
    require_admin(user)

    exists = db.query(User).filter(
        (User.username == data.username) | (User.email == data.email)
    ).first()

    if exists:
        raise HTTPException(400, "Username or email already exists")

    new_user = User(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password),
        role=data.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # LOG THE ACTION
    log_action(db, user.id, "CREATE_USER", f"Created user {new_user.username}")

    return new_user


# ----------------------------------------
# UPDATE ADMIN Profile (ADMIN ONLY)
# ----------------------------------------
@router.put("/users/{user_id}", response_model=UserRead)
def admin_update_user(
    user_id: int,
    data: UserCreate,
    user = Depends(require_session),
    db: Session = Depends(get_db)
):
    require_admin(user)

    target = db.query(User).filter(User.id == user_id).first()

    if not target:
        raise HTTPException(404, "User not found")

    target.username = data.username
    target.email = data.email
    target.role = data.role
    target.hashed_password = hash_password(data.password)

    db.commit()
    db.refresh(target)

    return target


# ----------------------------------------
# UPDATE USER STATUS (ADMIN ONLY)
# ----------------------------------------
@router.patch("/users/{user_id}/status")
def update_user_status(
    user_id: int,
    data: UpdateStatus,
    db: Session = Depends(get_db),
    admin = Depends(require_session)
):
    # Check if ADMIN
    require_admin(admin)

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(404, "User not found")

    if data.status not in ["active", "disabled", "banned"]:
        raise HTTPException(400, "Invalid status")

    user.status = data.status
    db.commit()
    db.refresh(user)

    return {"message": "User status updated", "user": user}


# ----------------------------------------
# ADMIN RESET PW (ADMIN ONLY)
# ----------------------------------------
@router.patch("/users/{user_id}/reset-password")
def admin_reset_password(
    user_id: int,
    data: AdminResetPassword,
    admin = Depends(require_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(404, "User not found")

    # Optional safety: Prevent admins from changing other admins’ passwords
    if user.role == "admin" and admin.id != user_id:
        raise HTTPException(403, "You cannot reset another admin's password")

    user.hashed_password = hash_password(data.new_password)
    db.commit()

    return {"message": "Password reset successfully"}


# ----------------------------------------
# DELETE USER (ADMIN ONLY)
# ----------------------------------------
@router.delete("/users/{user_id}")
def admin_delete_user(
    user_id: int,
    user = Depends(require_session),
    db: Session = Depends(get_db)
):
    require_admin(user)

    target = db.query(User).filter(User.id == user_id).first()

    if not target:
        raise HTTPException(404, "User not found")

    db.delete(target)
    db.commit()

    log_action(db, user.id, "DELETE_USER", f"Deleted user ID {user_id}")

    return {"message": f"User {user_id} deleted"}