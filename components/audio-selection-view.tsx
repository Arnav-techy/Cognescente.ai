import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Sparkles, UploadCloud } from "lucide-react";
import { NeonRGBTextEffect } from "@/components/ui/neon-rgbtext-effect";
import { GlassAudioCard } from "@/components/ui/glass-audio-card";
import { DEMO_AUDIO_SAMPLES, type DemoAudioSample } from "@/lib/audio-samples";
import { cn } from "@/lib/utils";

export interface AudioSelectionViewProps {
  onBack: () => void;
  onAnalyze: (sample: DemoAudioSample | { id: string; title: string; description: string; src: string; type: "custom"; file: File }) => void;
  onCustomUpload?: (file: File) => void;
}

export function AudioSelectionView({
  onBack,
  onAnalyze,
  onCustomUpload,
}: AudioSelectionViewProps) {
  const [selectedSample, setSelectedSample] = useState<DemoAudioSample | null>(null);
  const [playingSampleId, setPlayingSampleId] = useState<string | null>(null);
  const [playProgress, setPlayProgress] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize and cleanup audio player
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setPlayProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setPlayingSampleId(null);
      setPlayProgress(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audioRef.current = null;
    };
  }, []);

  // Handle Play/Pause toggle
  const handleTogglePlay = (sample: DemoAudioSample, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!audioRef.current) return;

    if (playingSampleId === sample.id) {
      audioRef.current.pause();
      setPlayingSampleId(null);
    } else {
      audioRef.current.src = sample.src;
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => {
          setPlayingSampleId(sample.id);
        })
        .catch((err) => {
          console.warn("Audio playback error:", err);
          setPlayingSampleId(null);
        });
    }
  };

  // Handle sample selection
  const handleSelectSample = (sample: DemoAudioSample) => {
    setSelectedSample(sample);
  };

  // Handle Analyze Voice CTA click
  const handleAnalyzeClick = () => {
    if (!selectedSample) return;

    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingSampleId(null);
    }

    onAnalyze(selectedSample);
  };

  // Handle custom audio upload
  const handleCustomFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCustomUpload?.(file);
      const customSample = {
        id: "custom-upload",
        title: file.name,
        description: "Custom audio upload",
        src: URL.createObjectURL(file),
        type: "custom" as const,
        file,
      };
      // We can notify the user or set as selected
      setSelectedSample(customSample as unknown as DemoAudioSample);
    }
  };

  return (
    <section className="relative z-10 w-full min-h-screen flex flex-col items-center justify-start sm:justify-center px-4 py-8 sm:py-12 pb-24 select-none pointer-events-auto">
      {/* Top back button */}
      <div className="w-full max-w-3xl flex items-center justify-start mb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-xs sm:text-sm text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      {/* Header Container */}
      <div className="w-full max-w-3xl flex flex-col items-center text-center gap-1.5 mb-8">
        <NeonRGBTextEffect
          text="Select Audio"
          fontWeight={600}
          maxFontSize={44}
          minFontSize={28}
          intensity={0.8}
          className="h-12 sm:h-14 max-w-md"
        />
        <p className="text-xs sm:text-sm md:text-base text-zinc-400 font-normal tracking-wide">
          Choose a voice sample to analyze.
        </p>
      </div>

      {/* 2x2 Audio Sample Cards Grid */}
      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-6">
        {DEMO_AUDIO_SAMPLES.map((sample) => (
          <GlassAudioCard
            key={sample.id}
            sample={sample}
            isSelected={selectedSample?.id === sample.id}
            isPlaying={playingSampleId === sample.id}
            progress={playingSampleId === sample.id ? playProgress : 0}
            onSelect={handleSelectSample}
            onTogglePlay={handleTogglePlay}
          />
        ))}
      </div>

      {/* Bottom Actions: Analyze CTA and Custom Upload */}
      <div className="w-full max-w-3xl flex flex-col items-center gap-4 mt-2">
        {/* Analyze Voice Primary CTA */}
        <button
          type="button"
          disabled={!selectedSample}
          onClick={handleAnalyzeClick}
          className={cn(
            "relative flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ease-out cursor-pointer",
            selectedSample
              ? "bg-gradient-to-b from-[#22222d]/90 to-[#121218]/95 backdrop-blur-xl border border-white/30 text-white shadow-[0_0_30px_rgba(255,255,255,0.1),inset_0_1px_2px_rgba(255,255,255,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              : "bg-white/[0.03] backdrop-blur-md border border-white/5 text-zinc-600 cursor-not-allowed opacity-50 shadow-none"
          )}
        >
          <Sparkles className={cn("w-4 h-4", selectedSample ? "text-cyan-300" : "text-zinc-600")} />
          <span>Analyze Voice</span>
        </button>

        {/* Secondary: Upload your own audio */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleCustomFileChange}
            className="sr-only"
            id="custom-audio-input"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload your own audio</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default AudioSelectionView;
