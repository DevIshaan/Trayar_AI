export interface Session {
  id: string;
  userId: string;
  transcript: string;
  audioUrl: string;
  audioLocalUri?: string;
  duration: number;
  timestamp: string;
  status: SessionStatus;
  feedback?: Feedback;
  title?: string;
  patientType?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum SessionStatus {
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  READY = 'ready',
  ANALYZED = 'analyzed',
  FAILED = 'failed',
}

export interface UploadRequest {
  userId: string;
  file: File | { uri: string; name: string; type?: string };
  timestamp: string;
  type: 'recorded' | 'uploaded';
  title?: string;
  patientType?: string;
}

export interface UploadResponse {
  sessionId: string;
  status: SessionStatus;
  message: string;
  uploadUrl?: string;
}

export interface TranscriptionRequest {
  sessionId: string;
  audioUrl: string;
}

export interface TranscriptionResponse {
  transcript: string;
  duration: number;
  confidence: number;
  words: WordTimestamp[];
  speakers?: Speaker[];
}

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
  confidence: number;
  speaker?: number;
}

export interface Speaker {
  id: number;
  name?: string;
  confidence: number;
}

export interface SessionState {
  currentSession: Session | null;
  isRecording: boolean;
  isUploading: boolean;
  isProcessing: boolean;
  uploadProgress: number;
  recordingTime: number;
  audioLevels: number[];
  error: string | null;
}

export interface PlaybackState {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  playbackRate: number;
  volume: number;
  isBuffering: boolean;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioLevels: number[];
  quality: AudioQuality;
  format: AudioFormat;
}

export enum AudioQuality {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum AudioFormat {
  AAC = 'aac',
  MP4 = 'mp4',
  WAV = 'wav',
  MP3 = 'mp3',
}

export interface CreateSessionRequest {
  userId: string;
  transcript: string;
  audioUrl: string;
  duration: number;
  timestamp: string;
  title?: string;
  patientType?: string;
  notes?: string;
}