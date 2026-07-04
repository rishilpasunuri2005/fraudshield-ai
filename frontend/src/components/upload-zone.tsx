"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { UploadCloud, type LucideIcon } from "lucide-react";

export function UploadZone({
  accept,
  hint,
  icon: Icon = UploadCloud,
  onFile,
  className,
}: {
  accept: string;
  hint: string;
  icon?: LucideIcon;
  onFile: (file: File) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFile(file);
    },
    [onFile],
  );

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "glass group flex w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border p-12 text-center transition-all duration-200 hover:border-primary/60 hover:bg-primary/5",
        dragging && "border-primary bg-primary/10",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-16 items-center justify-center rounded-2xl bg-primary/15 text-primary transition-transform duration-200 group-hover:scale-110",
          dragging && "scale-110",
        )}
      >
        <Icon className="size-8" aria-hidden="true" />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-base font-medium">
          {dragging ? "Drop to upload" : "Drag and drop or click to upload"}
        </span>
        <span className="text-sm text-muted-foreground">{hint}</span>
      </span>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        aria-label="Upload file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />
    </button>
  );
}
