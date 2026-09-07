export type VoiceClassification = "authentic" | "synthetic";

export interface DetectionSignal {
  title: string;
  description: string;
  status: "positive" | "warning" | "neutral";
}

export interface AnalysisResult {
  verdict: "AUTHENTIC" | "SYNTHETIC";
  verdictTitle: string;
  primaryScore: number;
  primaryScoreLabel: string;
  speakerConfidence: number;
  riskScore: number;
  status: "LOW RISK" | "HIGH RISK";
  summary: string;
  signals: DetectionSignal[];
}

export interface DemoAudioSample {
  id: string;
  title: string;
  description: string;
  src: string;
  type: VoiceClassification;
  waveform: number[];
  analysis: AnalysisResult;
}

export const DEMO_AUDIO_SAMPLES: DemoAudioSample[] = [
  {
    id: "sample-1",
    title: "Voice Sample 01",
    description: "Audio sample",
    src: "/demo-audio/human1.mp3",
    type: "authentic",
    waveform: [25, 45, 70, 55, 80, 95, 60, 40, 65, 85, 90, 75, 50, 60, 80, 70, 45, 65, 85, 55, 40, 30, 20],
    analysis: {
      verdict: "AUTHENTIC",
      verdictTitle: "AUTHENTIC VOICE",
      primaryScore: 98,
      primaryScoreLabel: "Authenticity Score",
      speakerConfidence: 96,
      riskScore: 7,
      status: "LOW RISK",
      summary: "No significant indicators of synthetic voice generation detected.",
      signals: [
        {
          title: "VOICE AUTHENTICITY",
          description: "No significant synthetic indicators",
          status: "positive",
        },
        {
          title: "SPEAKER CONSISTENCY",
          description: "Voice characteristics are consistent",
          status: "positive",
        },
        {
          title: "AUDIO SIGNAL",
          description: "Signal quality is suitable for analysis",
          status: "neutral",
        },
        {
          title: "OVERALL ASSESSMENT",
          description: "No significant indicators of synthetic generation detected",
          status: "positive",
        },
      ],
    },
  },
  {
    id: "sample-2",
    title: "Voice Sample 02",
    description: "Audio sample",
    src: "/demo-audio/human2.mp3",
    type: "authentic",
    waveform: [20, 35, 60, 80, 65, 90, 85, 50, 70, 95, 80, 60, 45, 55, 75, 65, 50, 40, 30, 25, 20, 15, 10],
    analysis: {
      verdict: "AUTHENTIC",
      verdictTitle: "AUTHENTIC VOICE",
      primaryScore: 94,
      primaryScoreLabel: "Authenticity Score",
      speakerConfidence: 91,
      riskScore: 12,
      status: "LOW RISK",
      summary: "No significant indicators of synthetic voice generation detected.",
      signals: [
        {
          title: "VOICE AUTHENTICITY",
          description: "No significant synthetic indicators",
          status: "positive",
        },
        {
          title: "SPEAKER CONSISTENCY",
          description: "Voice characteristics are consistent",
          status: "positive",
        },
        {
          title: "AUDIO SIGNAL",
          description: "Signal quality is suitable for analysis",
          status: "neutral",
        },
        {
          title: "OVERALL ASSESSMENT",
          description: "No significant indicators of synthetic generation detected",
          status: "positive",
        },
      ],
    },
  },
  {
    id: "sample-3",
    title: "Voice Sample 03",
    description: "Audio sample",
    src: "/demo-audio/ai1.mp3",
    type: "synthetic",
    waveform: [30, 65, 85, 90, 80, 95, 90, 85, 90, 95, 85, 90, 80, 85, 90, 75, 80, 65, 50, 40, 30, 20, 15],
    analysis: {
      verdict: "SYNTHETIC",
      verdictTitle: "SYNTHETIC VOICE DETECTED",
      primaryScore: 92,
      primaryScoreLabel: "Synthetic Probability",
      speakerConfidence: 21,
      riskScore: 93,
      status: "HIGH RISK",
      summary: "Voice characteristics indicate likely synthetic generation.",
      signals: [
        {
          title: "VOICE AUTHENTICITY",
          description: "Synthetic characteristics detected",
          status: "warning",
        },
        {
          title: "SPEAKER CONSISTENCY",
          description: "Low confidence match",
          status: "warning",
        },
        {
          title: "AUDIO SIGNAL",
          description: "Patterns inconsistent with natural speech",
          status: "warning",
        },
        {
          title: "OVERALL ASSESSMENT",
          description: "Multiple indicators suggest synthetic generation",
          status: "warning",
        },
      ],
    },
  },
  {
    id: "sample-4",
    title: "Voice Sample 04",
    description: "Audio sample",
    src: "/demo-audio/ai2.mp3",
    type: "synthetic",
    waveform: [25, 50, 75, 85, 90, 85, 95, 90, 85, 90, 80, 85, 75, 80, 70, 65, 55, 45, 35, 30, 25, 20, 15],
    analysis: {
      verdict: "SYNTHETIC",
      verdictTitle: "SYNTHETIC VOICE DETECTED",
      primaryScore: 86,
      primaryScoreLabel: "Synthetic Probability",
      speakerConfidence: 24,
      riskScore: 89,
      status: "HIGH RISK",
      summary: "Voice characteristics indicate likely synthetic generation.",
      signals: [
        {
          title: "VOICE AUTHENTICITY",
          description: "Synthetic characteristics detected",
          status: "warning",
        },
        {
          title: "SPEAKER CONSISTENCY",
          description: "Low confidence match",
          status: "warning",
        },
        {
          title: "AUDIO SIGNAL",
          description: "Patterns inconsistent with natural speech",
          status: "warning",
        },
        {
          title: "OVERALL ASSESSMENT",
          description: "Multiple indicators suggest synthetic generation",
          status: "warning",
        },
      ],
    },
  },
];
