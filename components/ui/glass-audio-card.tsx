import React from "react";
import { Play, Pause, Check, Volume2, AudioLines } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DemoAudioSample } from "@/lib/audio-samples";

export interface GlassAudioCardProps {
  sample: DemoAudioSample;
  isSelected: boolean;
  isPlaying: boolean;
  progress?: number; // 0 to 100
  onSelect: (sample: DemoAudioSample) => void;
  onTogglePlay: (sample: DemoAudioSample, e: React.MouseEvent) => void;
  className?: string;
}

export function GlassAudioCard({
  sample,
  isSelected,
  isPlaying,
  progress = 0,
  onSelect,
  onTogglePlay,
  className,
}: GlassAudioCardProps) {
  return (
    <div
      onClick={() => onSelect(sample)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(sample);
        }
      }}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      className={cn(
        "group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl transition-all duration-300 ease-out cursor-pointer select-none text-left",
        "backdrop-blur-xl overflow-hidden",
        isSelected
          ? "bg-gradient-to-b from-[#1c1c24]/90 to-[#101016]/95 border border-white/40 shadow-[0_0_28px_rgba(255,255,255,0.08),inset_0_1px_2px_rgba(255,255,255,0.35)]"
          : "bg-gradient-to-b from-[#14141a]/70 to-[#0b0b0f]/80 border border-white/10 hover:border-white/25 hover:from-[#181820]/80 hover:to-[#0e0e13]/90 hover:shadow-[0_0_20px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]",
        className
      )}
    >
      {/* Top row: Icon, Category & Selection Checkmark */}
      <div className="flex items-start justify-between w-full gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center justify-center w-9 h-9 rounded-xl transition-colors",
              isSelected
                ? "bg-white/15 border border-white/30 text-white"
                : "bg-white/[0.06] border border-white/10 text-zinc-400 group-hover:text-zinc-200 group-hover:bg-white/[0.1]"
            )}
          >
            {isPlaying ? (
              <AudioLines className="w-4 h-4 animate-pulse text-cyan-300" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-medium text-white tracking-wide">
              {sample.title}
            </h3>
            <p className="text-xs text-zinc-400 font-normal tracking-normal mt-0.5">
              {sample.description}
            </p>
          </div>
        </div>

        {/* Selection Indicator Check */}
        <div
          className={cn(
            "flex items-center justify-center w-5 h-5 rounded-full transition-all duration-200",
            isSelected
              ? "bg-white/20 border border-white/40 text-white scale-100 opacity-100"
              : "border border-white/10 text-transparent scale-90 opacity-40 group-hover:opacity-70"
          )}
        >
          {isSelected && <Check className="w-3 h-3 text-white stroke-[2.5]" />}
        </div>
      </div>

      {/* Bottom row: Mini waveform / progress bar + Play button */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
        {/* Progress bar and subtle audio visualizer */}
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex items-center gap-1 h-3">
            {[40, 75, 55, 90, 60, 80, 45, 70, 85, 50, 65, 95, 40].map((h, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-1 rounded-full transition-all duration-200",
                  isPlaying
                    ? "bg-white/70 animate-pulse"
                    : isSelected
                    ? "bg-white/30"
                    : "bg-white/15 group-hover:bg-white/25"
                )}
                style={{
                  height: isPlaying ? `${Math.max(20, (h + (idx % 3) * 15) % 100)}%` : `${h * 0.3}%`,
                  animationDelay: `${idx * 75}ms`,
                }}
              />
            ))}
          </div>

          {/* Linear progress track */}
          <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-150 rounded-full",
                isPlaying ? "bg-white/90" : "bg-white/40"
              )}
              style={{ width: `${isPlaying ? progress : 0}%` }}
            />
          </div>
        </div>

        {/* Play / Pause Toggle Button */}
        <button
          type="button"
          onClick={(e) => onTogglePlay(sample, e)}
          className={cn(
            "relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200",
            "border cursor-pointer",
            isPlaying
              ? "bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]"
              : isSelected
              ? "bg-white/20 text-white border-white/30 hover:bg-white/30"
              : "bg-white/[0.08] text-zinc-300 border-white/15 hover:bg-white/15 hover:text-white"
          )}
          aria-label={isPlaying ? `Pause ${sample.title}` : `Play preview for ${sample.title}`}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
}

export default GlassAudioCard;
