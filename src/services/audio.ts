import * as AV from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { AudioQuality, AudioFormat, RecordingState, PlaybackState } from '@/types/session';

export class AudioService {
  private recording: AV.Audio.Recording | null = null;
  private sound: AV.Sound | null = null;
  private audioMode: AV.Audio.AudioMode = {
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  };

  constructor() {
    this.setupAudioMode();
  }

  private async setupAudioMode(): Promise<void> {
    try {
      await AV.Audio.setAudioModeAsync(this.audioMode);
    } catch (error) {
      console.error('Error setting audio mode:', error);
    }
  }

  // Recording Methods
  async startRecording(
    onRecordingStatusUpdate?: (status: AV.Audio.RecordingStatus) => void
  ): Promise<RecordingState> {
    try {
      await this.setupAudioMode();

      // Check permissions
      const { status } = await AV.Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Audio recording permission not granted');
      }

      // Create recording
      const recording = new AV.Audio.Recording();
      await recording.prepareToRecordAsync(this.getRecordingOptions());

      // Set up status update listener
      if (onRecordingStatusUpdate) {
        recording.setOnRecordingStatusUpdate(onRecordingStatusUpdate);
      }

      // Start recording
      await recording.startAsync();

      this.recording = recording;

      return {
        isRecording: true,
        isPaused: false,
        duration: 0,
        audioLevels: [],
        quality: AudioQuality.HIGH,
        format: AudioFormat.AAC,
      };
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  async pauseRecording(): Promise<RecordingState> {
    if (!this.recording) {
      throw new Error('No active recording');
    }

    try {
      await this.recording.pauseAsync();

      return {
        isRecording: true,
        isPaused: true,
        duration: this.recording.getStatusAsync().then(status => status.durationMillis || 0),
        audioLevels: [],
        quality: AudioQuality.HIGH,
        format: AudioFormat.AAC,
      };
    } catch (error) {
      console.error('Error pausing recording:', error);
      throw error;
    }
  }

  async resumeRecording(): Promise<RecordingState> {
    if (!this.recording) {
      throw new Error('No active recording');
    }

    try {
      await this.recording.resumeAsync();

      return {
        isRecording: true,
        isPaused: false,
        duration: this.recording.getStatusAsync().then(status => status.durationMillis || 0),
        audioLevels: [],
        quality: AudioQuality.HIGH,
        format: AudioFormat.AAC,
      };
    } catch (error) {
      console.error('Error resuming recording:', error);
      throw error;
    }
  }

  async stopRecording(): Promise<string> {
    if (!this.recording) {
      throw new Error('No active recording');
    }

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();

      if (!uri) {
        throw new Error('Recording failed to generate file');
      }

      this.recording = null;

      return uri;
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw error;
    }
  }

  async getRecordingDuration(): Promise<number> {
    if (!this.recording) {
      return 0;
    }

    try {
      const status = await this.recording.getStatusAsync();
      return status.durationMillis || 0;
    } catch (error) {
      console.error('Error getting recording duration:', error);
      return 0;
    }
  }

  async getRecordingLevels(): Promise<number[]> {
    if (!this.recording) {
      return [];
    }

    try {
      const status = await this.recording.getStatusAsync();
      if (status.metering) {
        // Get audio levels for waveform visualization
        return this.generateAudioLevels(status.durationMillis || 0);
      }
      return [];
    } catch (error) {
      console.error('Error getting recording levels:', error);
      return [];
    }
  }

  private generateAudioLevels(duration: number): number[] {
    const levels: number[] = [];
    const sampleInterval = 100; // Sample every 100ms
    const samples = Math.floor(duration / sampleInterval);

    for (let i = 0; i < samples; i++) {
      // Simulate audio levels - in a real implementation, you'd get these from the recording
      levels.push(Math.random() * 0.8 + 0.2);
    }

    return levels;
  }

  // Playback Methods
  async loadAudio(uri: string): Promise<void> {
    try {
      // Unload any existing sound
      await this.unloadAudio();

      // Create and load new sound
      const { sound } = await AV.Sound.createAsync(
        { uri },
        {
          shouldPlay: false,
          isLooping: false,
          volume: 1.0,
        }
      );

      this.sound = sound;

      // Set up status update listener
      sound.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
    } catch (error) {
      console.error('Error loading audio:', error);
      throw error;
    }
  }

  async playAudio(
    onPlaybackStatusUpdate?: (status: AV.Audio.PlaybackStatus) => void
  ): Promise<PlaybackState> {
    if (!this.sound) {
      throw new Error('No audio loaded');
    }

    try {
      const status = await this.sound.getStatusAsync();

      if (!status.isLoaded) {
        throw new Error('Audio not loaded');
      }

      if (status.isPlaying) {
        return this.getPlaybackState();
      }

      await this.sound.playAsync();

      return {
        isPlaying: true,
        duration: status.durationMillis || 0,
        currentTime: status.positionMillis || 0,
        playbackRate: status.rate || 1.0,
        volume: status.volume || 1.0,
        isBuffering: false,
      };
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  }

  async pauseAudio(): Promise<PlaybackState> {
    if (!this.sound) {
      throw new Error('No audio loaded');
    }

    try {
      await this.sound.pauseAsync();
      return this.getPlaybackState();
    } catch (error) {
      console.error('Error pausing audio:', error);
      throw error;
    }
  }

  async stopAudio(): Promise<PlaybackState> {
    if (!this.sound) {
      throw new Error('No audio loaded');
    }

    try {
      await this.sound.stopAsync();
      return this.getPlaybackState();
    } catch (error) {
      console.error('Error stopping audio:', error);
      throw error;
    }
  }

  async seekAudio(position: number): Promise<PlaybackState> {
    if (!this.sound) {
      throw new Error('No audio loaded');
    }

    try {
      const status = await this.sound.getStatusAsync();
      if (status.isLoaded && status.durationMillis) {
        await this.sound.setPositionAsync(Math.min(position, status.durationMillis));
      }
      return this.getPlaybackState();
    } catch (error) {
      console.error('Error seeking audio:', error);
      throw error;
    }
  }

  async setPlaybackRate(rate: number): Promise<PlaybackState> {
    if (!this.sound) {
      throw new Error('No audio loaded');
    }

    try {
      await this.sound.setRateAsync(rate, true);
      return this.getPlaybackState();
    } catch (error) {
      console.error('Error setting playback rate:', error);
      throw error;
    }
  }

  async setVolume(volume: number): Promise<PlaybackState> {
    if (!this.sound) {
      throw new Error('No audio loaded');
    }

    try {
      await this.sound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
      return this.getPlaybackState();
    } catch (error) {
      console.error('Error setting volume:', error);
      throw error;
    }
  }

  async getPlaybackState(): Promise<PlaybackState> {
    if (!this.sound) {
      return {
        isPlaying: false,
        duration: 0,
        currentTime: 0,
        playbackRate: 1.0,
        volume: 1.0,
        isBuffering: false,
      };
    }

    try {
      const status = await this.sound.getStatusAsync();

      return {
        isPlaying: status.isPlaying || false,
        duration: status.durationMillis || 0,
        currentTime: status.positionMillis || 0,
        playbackRate: status.rate || 1.0,
        volume: status.volume || 1.0,
        isBuffering: status.isBuffering || false,
      };
    } catch (error) {
      console.error('Error getting playback state:', error);
      return {
        isPlaying: false,
        duration: 0,
        currentTime: 0,
        playbackRate: 1.0,
        volume: 1.0,
        isBuffering: false,
      };
    }
  }

  async unloadAudio(): Promise<void> {
    if (this.sound) {
      try {
        await this.sound.unloadAsync();
        this.sound = null;
      } catch (error) {
        console.error('Error unloading audio:', error);
      }
    }
  }

  private onPlaybackStatusUpdate = (status: AV.Audio.PlaybackStatus): void => {
    // This can be used to emit events or update state
    // In a real implementation, you might use an event emitter
    if (__DEV__) {
      console.log('Playback status update:', status);
    }
  };

  // File Management
  async deleteAudioFile(uri: string): Promise<void> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(uri);
      }
    } catch (error) {
      console.error('Error deleting audio file:', error);
      throw error;
    }
  }

  async getAudioFileInfo(uri: string): Promise<{ size: number; duration?: number }> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const size = fileInfo.size || 0;

      // For duration, you might need to load the audio and check its status
      let duration: number | undefined;
      try {
        await this.loadAudio(uri);
        const state = await this.getPlaybackState();
        duration = state.duration;
        await this.unloadAudio();
      } catch (error) {
        // Duration not available
      }

      return { size, duration };
    } catch (error) {
      console.error('Error getting audio file info:', error);
      return { size: 0 };
    }
  }

  // Utility Methods
  private getRecordingOptions(): AV.Audio.RecordingOptions {
    return {
      android: {
        extension: '.aac',
        outputFormat: AV.AndroidOutputFormat.AAC_ADTS,
        audioEncoder: AV.AndroidAudioEncoder.AAC,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
        maxFileSize: 100 * 1024 * 1024, // 100MB
      },
      ios: {
        extension: '.aac',
        outputFormat: AV.IOSOutputFormat.AAC,
        audioQuality: AV.IOSAudioQuality.HIGH,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
    };
  }

  // Cleanup
  async cleanup(): Promise<void> {
    try {
      if (this.recording) {
        await this.recording.stopAndUnloadAsync();
        this.recording = null;
      }

      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }
    } catch (error) {
      console.error('Error cleaning up audio service:', error);
    }
  }

  // Permission Management
  static async getAudioPermissions(): Promise<boolean> {
    try {
      const { status } = await AV.Audio.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking audio permissions:', error);
      return false;
    }
  }

  static async requestAudioPermissions(): Promise<boolean> {
    try {
      const { status } = await AV.Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting audio permissions:', error);
      return false;
    }
  }
}

// Create singleton instance
export const audioService = new AudioService();
export default audioService;