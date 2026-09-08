import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { NeonRGBTextEffect } from "@/components/ui/neon-rgbtext-effect";
import { GlassUploadButton } from "@/components/ui/glass-upload-button";
import { AnalysisView } from "@/components/analysis-view";
import type { DemoAudioSample } from "@/lib/audio-samples";

export type AppState = "landing" | "analysis";

export function App() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [selectedAudio, setSelectedAudio] = useState<DemoAudioSample | null>(null);
  const [customFile, setCustomFile] = useState<{ id: string; title: string; description: string; src: string; type: "custom"; file: File } | null>(null);

  const handleFileSelect = (file: File) => {
    const customSample = {
      id: "custom-landing-upload",
      title: file.name,
      description: "Custom audio upload",
      src: URL.createObjectURL(file),
      type: "custom" as const,
      file,
    };
    setCustomFile(customSample);
  };

  const handleAnalyzeCustom = () => {
    if (customFile) {
      handleSelectToAnalyze(customFile);
    }
  };
  
  const handleClearCustom = () => {
    setCustomFile(null);
  };

  const handleSelectToAnalyze = (sample: DemoAudioSample | { id: string; title: string; description: string; src: string; type: "custom"; file: File }) => {
    setSelectedAudio(sample as DemoAudioSample);
    setAppState("analysis");
  };

  return (
    <main className="relative h-screen w-full overflow-y-auto overflow-x-hidden no-scrollbar bg-transparent select-none">
      {/* Existing animated DottedSurface background - UNCHANGED */}
      <DottedSurface />

      {/* View 1: Landing Page */}
      {appState === "landing" && (
        <section className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center pb-24 sm:pb-28 md:pb-36 px-4 pointer-events-none">
          <div className="flex flex-col items-center justify-center w-full max-w-5xl text-center gap-1 sm:gap-2">
            {/* Main Title: Dominant, large 72-96px desktop size with RGB effect */}
            <NeonRGBTextEffect
              text="Cognescente.ai"
              fontWeight={700}
              maxFontSize={94}
              minFontSize={36}
              intensity={1.0}
              className="h-24 sm:h-32 md:h-36 lg:h-40 max-w-4xl"
            />

            {/* Tagline: Same RGB treatment, smaller & lighter weight */}
            <NeonRGBTextEffect
              text="The intelligence behind a trusted call."
              fontWeight={400}
              maxFontSize={20}
              minFontSize={12}
              intensity={0.7}
              className="h-6 sm:h-7 md:h-8 max-w-xl"
            />

            {/* Upload Audio CTA button or Preview */}
            <div className="mt-5 sm:mt-6 md:mt-7 flex flex-col items-center gap-4 w-full max-w-md pointer-events-auto min-h-[140px]">
              {!customFile ? (
                <GlassUploadButton onFileSelect={handleFileSelect} />
              ) : (
                <div className="flex flex-col items-center gap-5 w-full animate-in fade-in zoom-in-95 duration-300">
                  <div className="relative w-full flex flex-col items-center gap-2 bg-white/[0.04] border border-white/10 rounded-2xl p-4">
                    <div className="w-full flex justify-between items-center px-1">
                      <span className="text-sm text-zinc-300 font-medium truncate">{customFile.title}</span>
                      <button
                        onClick={handleClearCustom}
                        className="w-6 h-6 bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-zinc-400 hover:text-white rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer shrink-0"
                        title="Remove audio"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <audio 
                      controls 
                      src={customFile.src} 
                      className="w-full max-w-[400px] h-10"
                    />
                  </div>
                  
                  <button
                    onClick={handleAnalyzeCustom}
                    className={cn(
                      "relative flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ease-out cursor-pointer",
                      "bg-gradient-to-b from-[#22222d]/90 to-[#121218]/95 backdrop-blur-xl border border-white/30 text-white shadow-[0_0_30px_rgba(255,255,255,0.1),inset_0_1px_2px_rgba(255,255,255,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                    )}
                  >
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Analyze Voice</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* View 2: Analysis State */}
      {appState === "analysis" && (
        <AnalysisView
          selectedSample={selectedAudio}
          onBack={() => setAppState("landing")}
          onAnalyzeAnother={() => setAppState("landing")}
        />
      )}
    </main>
  );
}

export default App;
