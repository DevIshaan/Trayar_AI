export interface Feedback {
  id: string;
  sessionId: string;
  userId: string;
  raise: RaiseFeedback;
  scores: FeedbackScores;
  summary: string;
  suggestions: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface RaiseFeedback {
  recognize: string;    // Positive communication behaviors
  assess: string;       // Clarity/tone evaluation
  identify: string;     // Weaknesses identified
  shape: string;        // Actionable improvements
  establish: string;    // Long-term goals
}

export interface FeedbackScores {
  empathy: number;
  clarity: number;
  tone: number;
  professionalism: number;
  overall: number;
}

export interface AnalysisRequest {
  sessionId: string;
  transcript: string;
  userId: string;
  options?: AnalysisOptions;
}

export interface AnalysisOptions {
  includeSentiment?: boolean;
  includeSpeakerAnalysis?: boolean;
  focusAreas?: FocusArea[];
  customPrompt?: string;
}

export interface FocusArea {
  area: 'empathy' | 'clarity' | 'tone' | 'professionalism' | 'listening';
  weight: number; // 0-1
}

export interface AnalysisResponse {
  feedback: Feedback;
  processingTime: number;
  confidence: number;
  warnings?: string[];
}

export interface FeedbackGenerationState {
  isGenerating: boolean;
  progress: number;
  currentStage: AnalysisStage;
  estimatedTimeRemaining: number;
  error: string | null;
}

export enum AnalysisStage {
  INITIALIZING = 'initializing',
  TRANSCRIBING = 'transcribing',
  ANALYZING = 'analyzing',
  GENERATING = 'generating',
  FINALIZING = 'finalizing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface FeedbackTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  focusAreas: FocusArea[];
  isDefault: boolean;
  createdBy: string;
}

export interface FeedbackComparison {
  sessionId1: string;
  sessionId2: string;
  feedback1: Feedback;
  feedback2: Feedback;
  improvements: string[];
  regressions: string[];
  trends: FeedbackTrend[];
}

export interface FeedbackTrend {
  area: keyof FeedbackScores;
  direction: 'improving' | 'declining' | 'stable';
  change: number;
  timeframe: string;
}

export interface SaveFeedbackRequest {
  sessionId: string;
  userId: string;
  raise: RaiseFeedback;
  scores: FeedbackScores;
  summary: string;
  suggestions: string[];
}

export interface FeedbackExportOptions {
  format: 'pdf' | 'json' | 'csv';
  includeTranscript?: boolean;
  includeScores?: boolean;
  includeTrends?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}