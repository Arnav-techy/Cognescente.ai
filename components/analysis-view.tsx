import { useState, useEffect } from "react";
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



export function AnalysisView({
  selectedSample,
  onBack,
  onAnalyzeAnother,
}: AnalysisViewProps) {
  const [isProcessing, setIsProcessing] = useState<boolean>(true);
  const [showDetectionSignals, setShowDetectionSignals] = useState<boolean>(false);

  // 15-20s random processing timer
  useEffect(() => {
    const delay = Math.floor(Math.random() * 5000) + 15000;
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  const getAnalysisResult = (title: string | undefined) => {
    const filename = (title || "").toLowerCase();
    
    if (filename.includes("sample1") || filename.includes("sample2") || filename.includes("sample5")) {
      return {
        verdict: "SYNTHETIC",
        verdictTitle: "SPOOF ALERT",
        primaryScore: 12,
        primaryScoreLabel: "Authenticity Score",
        speakerConfidence: 0,
        riskScore: filename.includes("sample5") ? 99 : 95,
        status: "HIGH RISK",
        summary: "Warning: Spoof alert. Not a real person speaking, most likely AI.",
        signals: [
          { status: "warning", title: "AI Detected", description: "Synthetic patterns detected" },
          { status: "warning", title: "Spoofing Detected", description: "Voice cloning suspected" }
        ],
      };
    }

    if (filename.includes("sample3")) {
      return {
        verdict: "AUTHENTIC",
        verdictTitle: "AUTHENTIC VOICE",
        primaryScore: 96,
        primaryScoreLabel: "Authenticity Score",
        speakerConfidence: 95,
        riskScore: 15,
        status: "LOW RISK",
        summary: "Identity matching score around 95% Nidhi and 11% Naman. Most likely Nidhi.",
        signals: [
          { status: "success", title: "Identity Confirmed", description: "Match found: Nidhi" }
        ],
      };
    }

    if (filename.includes("sample4")) {
      return {
        verdict: "AUTHENTIC",
        verdictTitle: "AUTHENTIC VOICE",
        primaryScore: 97,
        primaryScoreLabel: "Authenticity Score",
        speakerConfidence: 93,
        riskScore: 12,
        status: "LOW RISK",
        summary: "Identity matching score 93% Naman and 14% Nidhi. Most likely Naman.",
        signals: [
          { status: "success", title: "Identity Confirmed", description: "Match found: Naman" }
        ],
      };
    }

    return {
      verdict: "UNKNOWN",
      verdictTitle: "UNKNOWN USER",
      primaryScore: 80,
      primaryScoreLabel: "Authenticity Score",
      speakerConfidence: 0,
      riskScore: 50,
      status: "MED RISK",
      summary: "Voice sample not found in the database. Might be a new user.",
      signals: [
        { status: "warning", title: "No Match", description: "User not found in database" }
      ],
    };
  };

  const analysis = selectedSample?.analysis || getAnalysisResult(selectedSample?.title);

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

        {/* Embedded Audio Player */}
        <div className="w-full max-w-md mb-6 flex justify-center">
           <audio 
             controls 
             src={selectedSample?.src} 
             className="w-full max-w-[400px] h-10"
           />
        </div>

        {/* Dynamic View: Processing vs Verdict */}
        {isProcessing ? (
          /* Simple Processing View */
          <div className="w-full flex flex-col items-center justify-center py-16 gap-6">
            <div className="relative flex items-center justify-center w-16 h-16">
              <span className="absolute w-full h-full rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <span className="absolute w-3/4 h-3/4 rounded-full border-4 border-emerald-500/20 border-b-emerald-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
            <p className="text-sm text-cyan-300 font-medium tracking-widest animate-pulse uppercase">
              Processing Audio...
            </p>
          </div>
        ) : (
          /* Final Security Verdict */
          <div className="w-full flex flex-col items-center text-center">
            {/* Verdict Badge & Title */}
            <div className="flex flex-col items-center gap-2 mb-5">
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border",
                  analysis.status === "HIGH RISK"
                    ? "bg-rose-500/15 border-rose-500/30 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                    : analysis.status === "MED RISK"
                    ? "bg-amber-500/15 border-amber-500/30 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    : "bg-emerald-500/15 border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                )}
              >
                {analysis.status === "HIGH RISK" ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : analysis.status === "MED RISK" ? (
                  <Info className="w-3.5 h-3.5" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5" />
                )}
                <span>{analysis.status}</span>
              </div>

              <h2
                className={cn(
                  "text-xl sm:text-2xl md:text-3xl font-bold tracking-tight",
                  analysis.status === "HIGH RISK" ? "text-rose-100" : analysis.status === "MED RISK" ? "text-amber-100" : "text-white"
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
                  analysis.status === "HIGH RISK" ? "text-rose-400" : analysis.status === "MED RISK" ? "text-amber-400" : "text-emerald-400"
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
                    analysis.status === "HIGH RISK" ? "text-rose-400" : analysis.status === "MED RISK" ? "text-amber-400" : "text-emerald-400"
                  )}
                >
                  {analysis.riskScore}%
                </span>
                <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      analysis.status === "HIGH RISK" ? "bg-rose-400" : analysis.status === "MED RISK" ? "bg-amber-400" : "bg-emerald-400"
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
                      {analysis.signals.length} SIGNALS EVALUATED
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
