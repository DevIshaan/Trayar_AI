import axios from 'axios';
import { TranscriptionRequest, TranscriptionResponse, WordTimestamp } from '@/types/session';

export interface DeepgramConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  language: string;
  punctuate: boolean;
  profanityFilter: boolean;
  diarize: boolean;
  smartFormat: boolean;
}

export interface DeepgramWebsocketConfig {
  model: string;
  language: string;
  punctuate: boolean;
  profanity_filter: boolean;
  diarize: boolean;
  smart_format: boolean;
  interim_results: boolean;
  utterance_end_ms?: number;
  vad_turnoff?: number;
  encoding?: string;
  sample_rate?: number;
}

export class DeepgramService {
  private config: DeepgramConfig;
  private websocket: WebSocket | null = null;

  constructor() {
    this.config = {
      apiKey: process.env.EXPO_PUBLIC_DEEPGRAM_API_KEY || '',
      baseUrl: 'https://api.deepgram.com/v1',
      model: 'general',
      language: 'en',
      punctuate: true,
      profanityFilter: true,
      diarize: true,
      smartFormat: true,
    };

    if (!this.config.apiKey) {
      console.warn('Deepgram API key not configured');
    }
  }

  // Pre-recorded audio transcription
  async transcribeAudio(request: TranscriptionRequest): Promise<TranscriptionResponse> {
    try {
      if (!this.config.apiKey) {
        throw new Error('Deepgram API key not configured');
      }

      const endpoint = `${this.config.baseUrl}/listen`;
      const headers = {
        'Authorization': `Token ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      };

      const payload = {
        url: request.audioUrl,
        model: this.config.model,
        language: this.config.language,
        punctuate: this.config.punctuate,
        profanity_filter: this.config.profanityFilter,
        diarize: this.config.diarize,
        smart_format: this.config.smartFormat,
        utterances: true,
        paragraphs: true,
        // Additional options for dental conversations
        redact: ['phone_number', 'email_address', 'ssn', 'credit_card'],
        detect_language: false,
        multichannel: false,
        alternatives: 1,
      };

      const response = await axios.post(endpoint, payload, { headers });

      if (response.status !== 200) {
        throw new Error(`Deepgram API error: ${response.status}`);
      }

      const result = response.data.results;
      const transcript = this.extractTranscript(result);
      const words = this.extractWordTimestamps(result);
      const duration = this.calculateDuration(words);

      return {
        transcript,
        duration,
        confidence: this.calculateConfidence(result),
        words,
        speakers: this.extractSpeakers(result),
      };
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw new Error(`Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // File upload and transcription
  async transcribeFile(
    fileUri: string,
    fileName: string,
    mimeType: string = 'audio/mp4'
  ): Promise<TranscriptionResponse> {
    try {
      if (!this.config.apiKey) {
        throw new Error('Deepgram API key not configured');
      }

      const endpoint = `${this.config.baseUrl}/listen`;
      const headers = {
        'Authorization': `Token ${this.config.apiKey}`,
        'Content-Type': mimeType,
      };

      // Create FormData with the audio file
      const formData = new FormData();

      // For React Native, we need to handle the file differently
      if (fileUri.startsWith('file://')) {
        formData.append('file', {
          uri: fileUri,
          type: mimeType,
          name: fileName,
        } as any);
      } else {
        // For web or blob URLs
        const response = await fetch(fileUri);
        const blob = await response.blob();
        formData.append('file', blob, fileName);
      }

      // Add transcription parameters
      const params = new URLSearchParams({
        model: this.config.model,
        language: this.config.language,
        punctuate: this.config.punctuate.toString(),
        profanity_filter: this.config.profanityFilter.toString(),
        diarize: this.config.diarize.toString(),
        smart_format: this.config.smartFormat.toString(),
        utterances: 'true',
        paragraphs: 'true',
        redact: 'phone_number,email_address,ssn,credit_card',
        alternatives: '1',
      });

      const url = `${endpoint}?${params.toString()}`;

      const response = await axios.post(url, formData, {
        headers,
        timeout: 60000, // 60 second timeout for file uploads
      });

      if (response.status !== 200) {
        throw new Error(`Deepgram API error: ${response.status}`);
      }

      const result = response.data.results;
      const transcript = this.extractTranscript(result);
      const words = this.extractWordTimestamps(result);
      const duration = this.calculateDuration(words);

      return {
        transcript,
        duration,
        confidence: this.calculateConfidence(result),
        words,
        speakers: this.extractSpeakers(result),
      };
    } catch (error) {
      console.error('Error transcribing file:', error);
      throw new Error(`File transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Real-time transcription with WebSocket
  startRealTimeTranscription(
    onTranscript: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onConnected: () => void,
    onDisconnected: () => void
  ): void {
    try {
      if (!this.config.apiKey) {
        throw new Error('Deepgram API key not configured');
      }

      const websocketUrl = `wss://api.deepgram.com/v1/listen`;
      const config: DeepgramWebsocketConfig = {
        model: this.config.model,
        language: this.config.language,
        punctuate: this.config.punctuate,
        profanity_filter: this.config.profanityFilter,
        diarize: this.config.diarize,
        smart_format: this.config.smartFormat,
        interim_results: true,
        utterance_end_ms: 1000,
        vad_turnoff: 500,
        encoding: 'linear16',
        sample_rate: 16000,
      };

      const queryParams = new URLSearchParams({
        ...config,
        punctuate: config.punctuate.toString(),
        profanity_filter: config.profanity_filter.toString(),
        diarize: config.diarize.toString(),
        smart_format: config.smart_format.toString(),
        interim_results: config.interim_results.toString(),
        utterance_end_ms: config.utterance_end_ms?.toString() || '1000',
        vad_turnoff: config.vad_turnoff?.toString() || '500',
      });

      const wsUrl = `${websocketUrl}?${queryParams.toString()}`;

      this.websocket = new WebSocket(wsUrl, [], {
        headers: {
          'Authorization': `Token ${this.config.apiKey}`,
        },
      });

      this.websocket.onopen = () => {
        console.log('Deepgram WebSocket connected');
        onConnected();
      };

      this.websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.channel && data.channel.alternatives) {
            const alternative = data.channel.alternatives[0];
            const transcript = alternative.transcript;
            const isFinal = data.is_final || false;

            if (transcript.trim()) {
              onTranscript(transcript, isFinal);
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.websocket.onerror = (error) => {
        console.error('Deepgram WebSocket error:', error);
        onError('WebSocket connection error');
      };

      this.websocket.onclose = () => {
        console.log('Deepgram WebSocket disconnected');
        this.websocket = null;
        onDisconnected();
      };
    } catch (error) {
      console.error('Error starting real-time transcription:', error);
      onError('Failed to start real-time transcription');
    }
  }

  // Send audio data to WebSocket
  sendAudioData(audioData: ArrayBuffer): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(audioData);
    } else {
      console.warn('WebSocket not connected, cannot send audio data');
    }
  }

  // Stop real-time transcription
  stopRealTimeTranscription(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  // Helper methods for processing Deepgram responses
  private extractTranscript(result: any): string {
    try {
      if (!result.channels || !result.channels[0] || !result.channels[0].alternatives) {
        return '';
      }

      const alternatives = result.channels[0].alternatives;
      if (alternatives.length === 0) {
        return '';
      }

      return alternatives[0].transcript || '';
    } catch (error) {
      console.error('Error extracting transcript:', error);
      return '';
    }
  }

  private extractWordTimestamps(result: any): WordTimestamp[] {
    try {
      if (!result.channels || !result.channels[0] || !result.channels[0].alternatives) {
        return [];
      }

      const alternative = result.channels[0].alternatives[0];
      if (!alternative.words) {
        return [];
      }

      return alternative.words.map((word: any) => ({
        word: word.word,
        start: word.start,
        end: word.end,
        confidence: word.confidence || 0,
        speaker: word.speaker,
      }));
    } catch (error) {
      console.error('Error extracting word timestamps:', error);
      return [];
    }
  }

  private extractSpeakers(result: any): Array<{ id: number; name?: string; confidence: number }> {
    try {
      if (!result.channels || !result.channels[0]) {
        return [];
      }

      const channel = result.channels[0];
      const speakers: Set<number> = new Set();

      // Collect speaker IDs from words
      if (channel.alternatives && channel.alternatives[0] && channel.alternatives[0].words) {
        channel.alternatives[0].words.forEach((word: any) => {
          if (word.speaker !== undefined) {
            speakers.add(word.speaker);
          }
        });
      }

      return Array.from(speakers).map(id => ({
        id,
        confidence: 0.8, // Default confidence
      }));
    } catch (error) {
      console.error('Error extracting speakers:', error);
      return [];
    }
  }

  private calculateDuration(words: WordTimestamp[]): number {
    if (words.length === 0) return 0;

    const lastWord = words[words.length - 1];
    return lastWord.end || 0;
  }

  private calculateConfidence(result: any): number {
    try {
      if (!result.channels || !result.channels[0] || !result.channels[0].alternatives) {
        return 0;
      }

      const alternative = result.channels[0].alternatives[0];
      return alternative.confidence || 0;
    } catch (error) {
      console.error('Error calculating confidence:', error);
      return 0;
    }
  }

  // Utility methods
  updateConfig(config: Partial<DeepgramConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): DeepgramConfig {
    return { ...this.config };
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.config.baseUrl}/projects`, {
        headers: {
          'Authorization': `Token ${this.config.apiKey}`,
        },
      });

      return response.status === 200;
    } catch (error) {
      console.error('Deepgram connection test failed:', error);
      return false;
    }
  }

  // Get supported models and languages
  async getModels(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.config.baseUrl}/models`, {
        headers: {
          'Authorization': `Token ${this.config.apiKey}`,
        },
      });

      return response.data.models || [];
    } catch (error) {
      console.error('Error fetching Deepgram models:', error);
      return [];
    }
  }

  async getLanguages(): Promise<Array<{ code: string; name: string }>> {
    try {
      const response = await axios.get(`${this.config.baseUrl}/languages`, {
        headers: {
          'Authorization': `Token ${this.config.apiKey}`,
        },
      });

      return response.data.languages || [];
    } catch (error) {
      console.error('Error fetching Deepgram languages:', error);
      return [];
    }
  }

  // Cleanup
  cleanup(): void {
    this.stopRealTimeTranscription();
  }
}

// Create singleton instance
export const deepgramService = new DeepgramService();
export default deepgramService;