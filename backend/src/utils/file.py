from pathlib import Path
from uuid import uuid4
from fastapi import UploadFile, HTTPException, status

UPLOAD_DIR = Path("media")
UPLOAD_DIR.mkdir(exist_ok=True)
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

async def save_upload_file(upload_file: UploadFile | None, sub_dir: str) -> str | None:
    if not upload_file:
        return None
    ext = Path(upload_file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image format",
        )
    filename = f"{uuid4().hex}{ext}"
    dir_path = UPLOAD_DIR / sub_dir
    dir_path.mkdir(parents=True, exist_ok=True)
    file_path = dir_path / filename
    content = await upload_file.read()
    with file_path.open("wb") as file:
        file.write(content)
    return str(file_path)
