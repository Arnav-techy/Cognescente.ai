import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GlassWaveformPlayerProps {
  title: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  waveform?: number[];
  onTogglePlay: () => void;
  className?: string;
}

export function GlassWaveformPlayer({
  title,
  isPlaying,
  currentTime,
  duration,
  waveform = [30, 45, 60, 80, 50, 70, 90, 65, 40, 55, 75, 85, 95, 60, 45, 70, 80, 50, 35, 25, 20],
  onTogglePlay,
  className,
}: GlassWaveformPlayerProps) {
  const progressRatio = duration > 0 ? Math.min(1, currentTime / duration) : 0;
  const totalBars = waveform.length;
  const playedBarCount = Math.floor(progressRatio * totalBars);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      className={cn(
        "w-full max-w-md flex items-center justify-between gap-3 px-4 py-3 rounded-2xl",
        "bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]",
        className
      )}
    >
      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={onTogglePlay}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black hover:bg-white/90 active:scale-95 transition-transform cursor-pointer shrink-0"
        aria-label={isPlaying ? "Pause Audio" : "Play Audio"}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5 fill-current" />
        ) : (
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
        )}
      </button>

      {/* Center: Title + Waveform */}
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-zinc-300 font-medium truncate">{title}</span>
          <span className="text-zinc-400 shrink-0">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Compact Waveform visualization */}
        <div className="flex items-center gap-1 h-5 w-full">
          {waveform.map((heightPercent, idx) => {
            const isPlayed = idx <= playedBarCount;
            // Subtle active vibration when playing
            const dynamicHeight = isPlaying
              ? Math.max(15, Math.min(100, heightPercent + Math.sin(currentTime * 8 + idx * 0.5) * 15))
              : heightPercent;

            return (
              <div
                key={idx}
                className={cn(
                  "flex-1 rounded-full transition-all duration-150",
                  isPlayed
                    ? "bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.4)]"
                    : "bg-white/15"
                )}
                style={{
                  height: `${dynamicHeight}%`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GlassWaveformPlayer;
