import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import type { Express } from 'express';
import { storageRoot, type UploadSubdir } from '../config/storage';

export function buildPublicPath(subdir: string, filename: string): string {
  return `/uploads/${subdir}/${filename}`;
}

export function uploadFile(file: Express.Multer.File, subdir: UploadSubdir) {
  const ext = path.extname(file.originalname).toLowerCase();
  const filename = `${crypto.randomUUID()}${ext}`;
  const relativePath = buildPublicPath(subdir, filename);
  const absolutePath = path.join(storageRoot, subdir, filename);

  return {
    filename,
    relativePath,
    absolutePath,
  };
}

export function deleteFile(relativePath: string | null | undefined): void {
  if (!relativePath || !relativePath.startsWith('/uploads/')) {
    return;
  }

  const relative = relativePath.replace(/^\/uploads\//, '');
  const absolutePath = path.join(storageRoot, relative);

  try {
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  } catch {
    // Ignore missing files during cleanup
  }
}
