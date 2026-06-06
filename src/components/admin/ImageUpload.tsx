import {
  type ChangeEvent,
  type DragEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { uploadImage, type UploadSubdir } from '../../services/uploadService';
import { resolveImageUrl } from '../../utils/imageUrl';
import { useAuth } from '../../hooks/useAuth';
import Skeleton from '../ui/Skeleton';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return 'Only JPEG, PNG, WebP, and GIF images are allowed';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Image must be smaller than 5 MB';
  }
  return null;
}

interface ImageUploadProps {
  value: string;
  onChange: (path: string) => void;
  onError?: (message: string) => void;
  subdir?: UploadSubdir;
  label?: string;
  previewAlt?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onError,
  subdir = 'projects',
  label = 'Image',
  previewAlt = 'Upload preview',
}: ImageUploadProps) {
  const {
    state: { token },
  } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const handleUpload = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        onError?.(validationError);
        return;
      }

      if (!token) {
        onError?.('Not authenticated');
        return;
      }

      const blobUrl = URL.createObjectURL(file);
      setLocalPreview(blobUrl);
      setUploading(true);

      try {
        const path = await uploadImage(file, token, subdir);
        URL.revokeObjectURL(blobUrl);
        setLocalPreview(null);
        onChange(path);
      } catch (err) {
        URL.revokeObjectURL(blobUrl);
        setLocalPreview(null);
        onError?.(err instanceof Error ? err.message : 'Failed to upload image');
      } finally {
        setUploading(false);
      }
    },
    [token, subdir, onChange, onError]
  );

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleUpload(file);
    }
    event.target.value = '';
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      await handleUpload(file);
    }
  };

  const previewSrc = localPreview ?? (value ? resolveImageUrl(value) : null);

  return (
    <div>
      <span className="mb-1 block font-sans text-sm font-semibold text-dark">
        {label}
      </span>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col gap-3 rounded-lg border-2 border-dashed p-4 transition-colors sm:flex-row sm:items-start ${
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-dark/20 bg-white'
        }`}
      >
        {previewSrc ? (
          <div className="relative h-24 w-24 flex-shrink-0">
            <img
              src={previewSrc}
              alt={previewAlt}
              className={`h-24 w-24 rounded-lg object-cover ${
                uploading ? 'opacity-50' : ''
              }`}
            />
            {uploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-lg bg-white/60">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-2 w-12" />
              </div>
            )}
          </div>
        ) : (
          <div
            aria-hidden="true"
            className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-lg bg-dark/5 font-sans text-xs text-muted"
          >
            No image
          </div>
        )}
        <div className="flex-1">
          <p className="font-sans text-sm text-muted">
            Drag and drop an image here, or{' '}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="font-semibold text-dark underline hover:no-underline disabled:opacity-50"
            >
              browse files
            </button>
          </p>
          <p className="mt-1 font-sans text-xs text-muted">
            JPEG, PNG, WebP, or GIF — max 5 MB
          </p>
          {uploading && (
            <p className="mt-2 font-sans text-sm text-muted" role="status">
              Uploading…
            </p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={uploading}
            className="sr-only"
          />
        </div>
      </div>
    </div>
  );
}
