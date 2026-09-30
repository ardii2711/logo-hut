"use client";

import { useState, useRef } from "react";
import { CloudUpload, CreditCard, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FileDropzoneProps {
  label: string;
  accept: string;
  maxSizeMB: number;
  value: FileList | null;
  onChange: (files: FileList | null) => void;
  error?: string;
  disabled?: boolean;
  icon?: "upload" | "id-card";
  description?: string;
}

export default function FileDropzone({
  label,
  accept,
  maxSizeMB,
  value,
  onChange,
  error,
  disabled,
  icon = "upload",
  description,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    onChange(files);
    generatePreview(files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (inputRef.current) {
        inputRef.current.files = files;
      }
      onChange(files);
      generatePreview(files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const generatePreview = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  };

  const handleRemove = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onChange(null);
    setPreview(null);
  };

  const file = value?.[0];

  const IconComponent = icon === "id-card" ? CreditCard : CloudUpload;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label-lg text-on-surface">
        {label} <span className="text-error">*</span>
      </label>
      
      {!file ? (
        <div
          className={cn(
            "cursor-pointer rounded-xl p-space-lg flex flex-col items-center justify-center text-center transition-all group",
            "bg-surface-container-low hover:bg-surface-container",
            isDragOver && "bg-surface-container border-secondary",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !disabled && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-full bg-surface-container-lowest group-hover:scale-110 flex items-center justify-center text-secondary mb-2 transition-transform shadow-sm">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className="text-label-lg text-on-surface font-semibold">
            Tarik & Lepas File {icon === "id-card" ? "KTP" : "Logo"} atau Klik Cari Dokumen
          </span>
          <span className="text-label-mono text-on-surface-variant mt-1">
            {description || `Format: ${accept.split(",").map(ext => ext.replace(/[.]/g, "").toUpperCase()).join(", ")} (Maksimal ${maxSizeMB} MB)`}
          </span>
        </div>
      ) : (
        <div className="border border-outline-variant rounded-xl p-space-md bg-surface-container-lowest">
          {preview ? (
            <div className="mb-3">
              <Image
                src={preview}
                alt="Preview"
                className="w-full h-48 object-contain bg-surface-container-low rounded-lg"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 bg-surface-container-low rounded-lg mb-3">
              <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                <FileText className="w-10 h-10" />
                <p className="text-body-sm">{file.name}</p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-body-sm text-on-surface truncate">
                {file.name}
              </p>
              <p className="text-label-mono text-on-surface-variant text-[11px]">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="ml-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-label-lg transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-body-sm text-error font-medium">{error}</p>
      )}
      
      {!file && icon === "id-card" && (
        <div className="flex items-center gap-1.5 mt-1 text-on-surface-variant">
          <span className="text-[16px]">🔒</span>
          <span className="text-body-sm text-[12px]">
            Disimpan aman di Private Storage panitia. Hanya digunakan untuk validasi sayembara.
          </span>
        </div>
      )}
    </div>
  );
}
