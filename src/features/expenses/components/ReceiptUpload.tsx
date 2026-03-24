import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/shared/lib/axios";

interface ReceiptUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
}

export function ReceiptUpload({ value, onChange }: ReceiptUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const { data } = await api.post<{ url: string }>("/expenses/upload-receipt", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        onChange(data.url);
      } catch {
        // Toast handled by axios interceptor
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
  });

  if (value) {
    return (
      <div className="relative rounded-md border p-2">
        <div className="flex items-center gap-2">
          <Image className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground truncate flex-1">Receipt uploaded</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onChange(undefined)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-md border-2 border-dashed p-4 text-center transition-colors ${
        isDragActive ? "border-primary bg-primary/5" : "border-input hover:border-muted-foreground"
      }`}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <p className="text-sm text-muted-foreground">Uploading...</p>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Drop receipt or click to upload (max 5MB)
          </p>
        </div>
      )}
    </div>
  );
}
