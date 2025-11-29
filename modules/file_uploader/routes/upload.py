from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
from datetime import datetime
import os
import pandas as pd

router = APIRouter()

# Folder where files are saved
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_excel(file: UploadFile = File(...)):
    original_filename = file.filename

    if not original_filename.endswith((".xlsx", ".xls", ".xlsm")):
        return {"error": "File must be an Excel file (.xlsx or .xls)"}

    file_path = UPLOAD_DIR / original_filename

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    return {
        "message": "File uploaded successfully!",
        "original_filename": original_filename,
        "saved_to": str(file_path)
    }


@router.get("/files")
def list_uploaded_files():
    files_info = []

    for file in UPLOAD_DIR.iterdir():
        if file.is_file():
            stats = file.stat()
            upload_time = datetime.fromtimestamp(stats.st_mtime)  # last modified = upload time

            files_info.append({
                "filename": file.name,
                "upload_date": upload_time.strftime("%Y-%m-%d %H:%M:%S"),
                "size_kb": round(stats.st_size / 1024, 2),
            })

    # Sort: latest first
    files_info.sort(key=lambda x: x["upload_date"], reverse=True)

    return {
        "total": len(files_info),
        "files": files_info
    }

@router.get("/read/{filename}")
def read_excel(filename: str):
    file_path = UPLOAD_DIR / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    df = pd.read_excel(file_path)

    # Convert NaN → None to avoid JSON errors
    df = df.where(pd.notnull(df), None)

    return {
        "filename": filename,
        "rows": len(df),
        "columns": list(df.columns),
        "preview": df.head(10).to_dict(orient="records")
    }


@router.delete("/delete/{filename}")
def delete_file(filename: str):
    file_path = UPLOAD_DIR / filename

    # Remove file
    if file_path.exists():
        os.remove(file_path)
    else:
        raise HTTPException(status_code=404, detail="File not found")

    return {"message": f"{filename} deleted"}