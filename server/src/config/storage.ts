import fs from 'fs';
import path from 'path';
import { env } from './env';

export const storageRoot = path.resolve(
  path.join(__dirname, '../..'),
  env.storagePath
);

export const uploadDirs = ['projects', 'testimonials', 'avatars'] as const;

export type UploadSubdir = (typeof uploadDirs)[number];

export function ensureStorageDirs(): void {
  if (!fs.existsSync(storageRoot)) {
    fs.mkdirSync(storageRoot, { recursive: true });
  }

  for (const dir of uploadDirs) {
    const fullPath = path.join(storageRoot, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  }
}
