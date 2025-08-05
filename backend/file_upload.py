import os
import shutil
import uuid
from pathlib import Path
from typing import Optional
from fastapi import UploadFile, HTTPException
from PIL import Image
import aiofiles

# Upload configuration
UPLOAD_DIR = Path("/app/backend/uploads")
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
ALLOWED_FILE_TYPES = ALLOWED_IMAGE_TYPES.union({"application/pdf"})

# Create upload directory if it doesn't exist
UPLOAD_DIR.mkdir(exist_ok=True)

class FileUploadManager:
    def __init__(self):
        self.upload_dir = UPLOAD_DIR
    
    async def save_file(self, file: UploadFile, subfolder: Optional[str] = None) -> dict:
        """Save uploaded file and return file info."""
        try:
            # Validate file type
            if file.content_type not in ALLOWED_FILE_TYPES:
                raise HTTPException(
                    status_code=400,
                    detail=f"File type {file.content_type} not allowed"
                )
            
            # Create subfolder if specified
            upload_path = self.upload_dir
            if subfolder:
                upload_path = upload_path / subfolder
                upload_path.mkdir(exist_ok=True)
            
            # Generate unique filename
            file_extension = Path(file.filename).suffix.lower()
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = upload_path / unique_filename
            
            # Save file
            async with aiofiles.open(file_path, 'wb') as f:
                content = await file.read()
                
                # Check file size
                if len(content) > MAX_FILE_SIZE:
                    raise HTTPException(
                        status_code=400,
                        detail=f"File too large. Maximum size is {MAX_FILE_SIZE / 1024 / 1024}MB"
                    )
                
                await f.write(content)
            
            # Optimize image if it's an image file
            if file.content_type in ALLOWED_IMAGE_TYPES:
                await self._optimize_image(file_path)
            
            # Return file info
            return {
                "filename": unique_filename,
                "original_filename": file.filename,
                "file_path": str(file_path),
                "file_size": len(content),
                "mime_type": file.content_type,
                "url": f"/api/files/{subfolder}/{unique_filename}" if subfolder else f"/api/files/{unique_filename}"
            }
            
        except Exception as e:
            # Clean up file if something went wrong
            if 'file_path' in locals() and file_path.exists():
                file_path.unlink()
            raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")
    
    async def _optimize_image(self, file_path: Path):
        """Optimize image file for web use."""
        try:
            with Image.open(file_path) as img:
                # Convert to RGB if necessary
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                
                # Resize if too large
                max_dimension = 1920
                if max(img.size) > max_dimension:
                    img.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)
                
                # Save optimized image
                img.save(file_path, optimize=True, quality=85)
        except Exception as e:
            print(f"Image optimization failed: {e}")
            # Continue without optimization if it fails
    
    def delete_file(self, file_path: str) -> bool:
        """Delete a file."""
        try:
            full_path = Path(file_path)
            if full_path.exists() and full_path.is_relative_to(self.upload_dir):
                full_path.unlink()
                return True
            return False
        except Exception:
            return False
    
    def get_file_path(self, filename: str, subfolder: Optional[str] = None) -> Path:
        """Get full path to a file."""
        if subfolder:
            return self.upload_dir / subfolder / filename
        return self.upload_dir / filename
    
    def list_files(self, subfolder: Optional[str] = None) -> list:
        """List all files in upload directory."""
        try:
            search_dir = self.upload_dir
            if subfolder:
                search_dir = search_dir / subfolder
            
            if not search_dir.exists():
                return []
            
            files = []
            for file_path in search_dir.iterdir():
                if file_path.is_file():
                    files.append({
                        "filename": file_path.name,
                        "size": file_path.stat().st_size,
                        "modified": file_path.stat().st_mtime,
                        "url": f"/api/files/{subfolder}/{file_path.name}" if subfolder else f"/api/files/{file_path.name}"
                    })
            
            return sorted(files, key=lambda x: x["modified"], reverse=True)
        except Exception:
            return []

# Global instance
file_manager = FileUploadManager()