import fs from 'fs';
import { Router } from 'express';
import multer from 'multer';
import { authGuard } from '../middleware/authGuard';
import { uploadFile } from '../services/storageService';
import { badRequest } from '../utils/errors';
import { uploadDirs, type UploadSubdir } from '../config/storage';

const router = Router();

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(badRequest('Only image files are allowed (jpeg, png, webp, gif)'));
    }
  },
});

function isUploadSubdir(value: string): value is UploadSubdir {
  return (uploadDirs as readonly string[]).includes(value);
}

router.post('/', authGuard, upload.single('file'), (req, res, next) => {
  try {
    if (!req.file) {
      throw badRequest('No file uploaded');
    }

    const subdirInput = req.body.subdir || 'projects';
    if (!isUploadSubdir(subdirInput)) {
      throw badRequest('Invalid upload subdir');
    }

    const { relativePath, absolutePath } = uploadFile(req.file, subdirInput);
    fs.writeFileSync(absolutePath, req.file.buffer);

    res.status(201).json({ path: relativePath });
  } catch (error) {
    next(error);
  }
});

export default router;
