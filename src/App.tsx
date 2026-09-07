import { useState } from "react";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { NeonRGBTextEffect } from "@/components/ui/neon-rgbtext-effect";
import { GlassUploadButton } from "@/components/ui/glass-upload-button";

export function App() {
  const [, setSelectedAudioFile] = useState<File | null>(null);

  const handleAudioSelect = (file: File) => {
    setSelectedAudioFile(file);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-transparent select-none">
      {/* Existing animated DottedSurface background - UNCHANGED */}
      <DottedSurface />

      {/* Centered overlay positioned slightly above vertical center */}
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

          {/* Upload Audio CTA button */}
          <div className="mt-5 sm:mt-6 md:mt-7">
            <GlassUploadButton onFileSelect={handleAudioSelect} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
