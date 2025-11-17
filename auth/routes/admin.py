from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.auth import require_session, require_admin, get_db
from models.users import User
from schemas.user import UserCreate, UserRead
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
# UPDATE USER (ADMIN ONLY)
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
