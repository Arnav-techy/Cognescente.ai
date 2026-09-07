import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Fingerprint,
  AudioWaveform,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { NeonRGBTextEffect } from "@/components/ui/neon-rgbtext-effect";
import { GlassWaveformPlayer } from "@/components/ui/glass-waveform-player";
import { cn } from "@/lib/utils";
import type { DemoAudioSample } from "@/lib/audio-samples";

export interface AnalysisViewProps {
  selectedSample: DemoAudioSample | null;
  onBack: () => void;
  onAnalyzeAnother: () => void;
}

type StageStatus = "pending" | "analyzing" | "complete";

interface PipelineStage {
  id: string;
  name: string;
  pendingText: string;
  analyzingText: string;
  getCompleteTitle: (sample: DemoAudioSample | null) => string;
  getCompleteSubtitle: (sample: DemoAudioSample | null) => string;
  icon: typeof Radio;
  status: StageStatus;
}

export function AnalysisView({
  selectedSample,
  onBack,
  onAnalyzeAnother,
}: AnalysisViewProps) {
  const [pipelineState, setPipelineState] = useState<"in-progress" | "complete">("in-progress");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showDetectionSignals, setShowDetectionSignals] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 4-stage pipeline definitions with meaningful completion messages
  const [stages, setStages] = useState<PipelineStage[]>([
    {
      id: "signal",
      name: "Audio Signal",
      pendingText: "Waiting to process",
      analyzingText: "Processing audio signal...",
      getCompleteTitle: () => "Processed",
      getCompleteSubtitle: () => "Signal quality: Good",
      icon: Radio,
      status: "analyzing",
    },
    {
      id: "identity",
      name: "Voice Identity",
      pendingText: "Waiting for signal",
      analyzingText: "Analyzing speaker characteristics...",
      getCompleteTitle: () => "Analyzed",
      getCompleteSubtitle: (sample) =>
        `Speaker confidence: ${sample?.analysis.speakerConfidence ?? 96}%`,
      icon: Fingerprint,
      status: "pending",
    },
    {
      id: "authenticity",
      name: "Voice Authenticity",
      pendingText: "Waiting for identity",
      analyzingText: "Checking for synthetic or manipulated speech...",
      getCompleteTitle: (sample) =>
        sample?.type === "authentic" ? "Verified" : "Synthetic indicators detected",
      getCompleteSubtitle: (sample) => {
        if (sample?.type === "authentic") {
          return `Authenticity score: ${sample.analysis.primaryScore}%`;
        }
        return `Authenticity score: ${100 - (sample?.analysis.primaryScore ?? 92)}%`;
      },
      icon: AudioWaveform,
      status: "pending",
    },
    {
      id: "risk",
      name: "Security Risk",
      pendingText: "Waiting for authenticity",
      analyzingText: "Evaluating overall risk...",
      getCompleteTitle: (sample) =>
        sample?.type === "authentic" ? "Low risk" : "High risk",
      getCompleteSubtitle: (sample) =>
        `Risk score: ${sample?.analysis.riskScore ?? 7}%`,
      icon: ShieldAlert,
      status: "pending",
    },
  ]);

  // Audio Playback Lifecycle
  useEffect(() => {
    if (!selectedSample) return;

    const audio = new Audio(selectedSample.src);
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    // Auto-play audio on entering analysis
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch((err) => {
      console.warn("Auto-play prevented:", err);
      setIsPlaying(false);
    });

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audioRef.current = null;
    };
  }, [selectedSample]);

  // Timed 4-Stage Security Pipeline (~4.5 seconds)
  useEffect(() => {
    // Stage 1 -> Complete & Stage 2 -> Analyzing at 1.0s
    const t1 = setTimeout(() => {
      setStages((prev) =>
        prev.map((s) => {
          if (s.id === "signal") return { ...s, status: "complete" };
          if (s.id === "identity") return { ...s, status: "analyzing" };
          return s;
        })
      );
    }, 1000);

    // Stage 2 -> Complete & Stage 3 -> Analyzing at 2.1s
    const t2 = setTimeout(() => {
      setStages((prev) =>
        prev.map((s) => {
          if (s.id === "identity") return { ...s, status: "complete" };
          if (s.id === "authenticity") return { ...s, status: "analyzing" };
          return s;
        })
      );
    }, 2100);

    // Stage 3 -> Complete & Stage 4 -> Analyzing at 3.4s
    const t3 = setTimeout(() => {
      setStages((prev) =>
        prev.map((s) => {
          if (s.id === "authenticity") return { ...s, status: "complete" };
          if (s.id === "risk") return { ...s, status: "analyzing" };
          return s;
        })
      );
    }, 3400);

    // Stage 4 -> Complete at 4.4s
    const t4 = setTimeout(() => {
      setStages((prev) =>
        prev.map((s) => ({ ...s, status: "complete" }))
      );
    }, 4400);

    // Final Verdict Reveal at 4.7s
    const t5 = setTimeout(() => {
      setPipelineState("complete");
    }, 4700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const analysis = selectedSample?.analysis || {
    verdict: "AUTHENTIC",
    verdictTitle: "AUTHENTIC VOICE",
    primaryScore: 98,
    primaryScoreLabel: "Authenticity Score",
    speakerConfidence: 96,
    riskScore: 7,
    status: "LOW RISK",
    summary: "No significant indicators of synthetic voice generation detected.",
    signals: [],
  };

  const isSynthetic = analysis.verdict === "SYNTHETIC";

  return (
    <section className="relative z-10 w-full min-h-screen flex flex-col items-center justify-start sm:justify-center px-4 py-8 sm:py-12 pb-24 md:pb-28 select-none pointer-events-auto">
      {/* Top Bar: Back Button */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-xs sm:text-sm text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <span className="text-xs text-zinc-500 font-mono">
          COGNESCENTE // SEC_OPS
        </span>
      </div>

      {/* Main Glassmorphism Analysis Card Container */}
      <div className="w-full max-w-2xl flex flex-col items-center rounded-3xl bg-gradient-to-b from-[#13131a]/85 to-[#0b0b0f]/95 border border-white/15 backdrop-blur-2xl p-6 sm:p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.25)]">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <NeonRGBTextEffect
            text="Voice Security Analysis"
            fontWeight={600}
            maxFontSize={36}
            minFontSize={22}
            intensity={0.8}
            className="h-10 sm:h-12 max-w-lg mb-1"
          />
          <p className="text-xs sm:text-sm text-zinc-400 font-medium tracking-wide">
            {selectedSample?.title || "Voice Sample"}
          </p>
        </div>

        {/* Embedded Compact Floating Waveform Audio Player */}
        <div className="w-full max-w-md mb-6">
          <GlassWaveformPlayer
            title={selectedSample?.title || "Voice Sample"}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            waveform={selectedSample?.waveform}
            onTogglePlay={togglePlay}
          />
        </div>

        {/* Dynamic View: Pipeline vs Verdict */}
        {pipelineState === "in-progress" ? (
          /* Staged 4-Step Analysis Pipeline with Detailed Outcomes */
          <div className="w-full max-w-md flex flex-col gap-3 py-2">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.id}
                  className={cn(
                    "flex items-center justify-between p-3.5 rounded-xl transition-all duration-300",
                    stage.status === "analyzing"
                      ? "bg-white/[0.08] border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                      : stage.status === "complete"
                      ? "bg-white/[0.04] border border-white/15"
                      : "bg-white/[0.01] border border-white/5 opacity-40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg transition-colors shrink-0",
                        stage.status === "analyzing"
                          ? "bg-cyan-500/20 text-cyan-300"
                          : stage.status === "complete"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-white/5 text-zinc-500"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div>
                      <p className="text-xs sm:text-sm font-medium text-white">
                        {stage.status === "complete"
                          ? `${stage.name} — ${stage.getCompleteTitle(selectedSample)}`
                          : stage.name}
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        {stage.status === "analyzing"
                          ? stage.analyzingText
                          : stage.status === "complete"
                          ? stage.getCompleteSubtitle(selectedSample)
                          : stage.pendingText}
                      </p>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="shrink-0 ml-2">
                    {stage.status === "complete" && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    {stage.status === "analyzing" && (
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      </div>
                    )}
                    {stage.status === "pending" && (
                      <span className="text-xs text-zinc-600">0{idx + 1}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Final Security Verdict */
          <div className="w-full flex flex-col items-center text-center">
            {/* Verdict Badge & Title */}
            <div className="flex flex-col items-center gap-2 mb-5">
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border",
                  isSynthetic
                    ? "bg-rose-500/15 border-rose-500/30 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                    : "bg-emerald-500/15 border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                )}
              >
                {isSynthetic ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5" />
                )}
                <span>{analysis.status}</span>
              </div>

              <h2
                className={cn(
                  "text-xl sm:text-2xl md:text-3xl font-bold tracking-tight",
                  isSynthetic ? "text-rose-100" : "text-white"
                )}
              >
                {analysis.verdictTitle}
              </h2>
            </div>

            {/* Primary Dominant Metric Display */}
            <div className="flex flex-col items-center mb-5">
              <div
                className={cn(
                  "text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-mono",
                  isSynthetic ? "text-rose-400" : "text-emerald-400"
                )}
              >
                {analysis.primaryScore}%
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium tracking-wide mt-1">
                {analysis.primaryScoreLabel}
              </p>
            </div>

            {/* Divider */}
            <div className="w-full max-w-md h-px bg-white/10 mb-5" />

            {/* Supporting Metrics */}
            <div className="w-full max-w-md grid grid-cols-2 gap-4 mb-5">
              <div className="flex flex-col p-3 rounded-xl bg-white/[0.03] border border-white/5 text-left">
                <span className="text-[11px] text-zinc-400">Speaker Confidence</span>
                <span className="text-lg sm:text-xl font-semibold text-white font-mono mt-0.5">
                  {analysis.speakerConfidence}%
                </span>
                <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-zinc-300 rounded-full"
                    style={{ width: `${analysis.speakerConfidence}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col p-3 rounded-xl bg-white/[0.03] border border-white/5 text-left">
                <span className="text-[11px] text-zinc-400">Risk Score</span>
                <span
                  className={cn(
                    "text-lg sm:text-xl font-semibold font-mono mt-0.5",
                    isSynthetic ? "text-rose-400" : "text-emerald-400"
                  )}
                >
                  {analysis.riskScore}%
                </span>
                <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      isSynthetic ? "bg-rose-400" : "bg-emerald-400"
                    )}
                    style={{ width: `${analysis.riskScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Summary Explanation */}
            <p className="text-xs sm:text-sm text-zinc-300 font-normal max-w-md leading-relaxed mb-6">
              {analysis.summary}
            </p>

            {/* Feature #1: Detection Signals Expandable Drawer */}
            <div className="w-full max-w-md mb-6">
              <button
                type="button"
                onClick={() => setShowDetectionSignals((prev) => !prev)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-cyan-300" />
                  <span>View Detection Signals</span>
                </div>
                {showDetectionSignals ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </button>

              {showDetectionSignals && (
                <div className="mt-2.5 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                      Signals Breakdown
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      4 SIGNALS EVALUATED
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {analysis.signals.map((sig, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-2 rounded-lg bg-white/[0.02]"
                      >
                        {sig.status === "warning" ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        )}
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-white tracking-wide">
                            {sig.title}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            {sig.description}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action: Analyze Another */}
            <button
              type="button"
              onClick={onAnalyzeAnother}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-medium",
                "bg-gradient-to-b from-[#22222d]/90 to-[#121218]/95 backdrop-blur-xl border border-white/25 text-white",
                "shadow-[0_0_24px_rgba(255,255,255,0.08),inset_0_1px_1px_rgba(255,255,255,0.3)]",
                "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all cursor-pointer"
              )}
            >
              <RotateCcw className="w-4 h-4 text-cyan-300" />
              <span>Analyze Another</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default AnalysisView;
