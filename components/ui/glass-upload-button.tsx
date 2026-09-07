import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GlassUploadButtonProps {
  onClick?: () => void;
  onFileSelect?: (file: File) => void;
  className?: string;
  accept?: string;
}

export function GlassUploadButton({
  onClick,
  onFileSelect,
  className,
  accept = "audio/*",
}: GlassUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onClick) {
        onClick();
      } else {
        fileInputRef.current?.click();
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      onFileSelect?.(file);
    }
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center group pointer-events-auto", className)}>
      {/* Hidden accessible file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="sr-only"
        id="audio-upload-input"
        aria-label="Upload Audio file"
      />

      {/* Main Glassmorphic Button */}
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative flex items-center gap-3 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full",
          "bg-gradient-to-b from-[#18181f]/80 to-[#0c0c10]/90 backdrop-blur-xl",
          "border border-white/15 hover:border-white/30",
          "shadow-[0_0_24px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)]",
          "hover:shadow-[0_0_30px_rgba(255,255,255,0.08),inset_0_1px_2px_rgba(255,255,255,0.35)]",
          "transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
          "focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none",
          "overflow-hidden cursor-pointer"
        )}
        title={selectedFileName ? `Selected: ${selectedFileName}` : "Upload Audio"}
      >
        {/* Subtle luminous border sweep / shimmer overlay */}
        <div
          className="absolute inset-0 rounded-full opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
          }}
        />

        {/* Circular glass badge for upload icon matching reference */}
        <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/[0.08] border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] group-hover:bg-white/[0.14] transition-colors">
          <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90 group-hover:text-white transition-colors" />
        </div>

        {/* Button label */}
        <span className="text-xs sm:text-sm font-medium text-white/90 group-hover:text-white tracking-wide transition-colors">
          Upload Audio
        </span>
      </button>
    </div>
  );
}

export default GlassUploadButton;
