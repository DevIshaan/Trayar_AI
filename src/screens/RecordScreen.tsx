import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';

// Import components
import { Button, Card, Loading } from '@/components/ui';

const RecordScreen: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mode, setMode] = useState<'record' | 'upload'>('record');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Record Audio</Text>
        <Text style={styles.subtitle}>Choose how to add your conversation</Text>
      </View>

      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'record' && styles.activeMode]}
          onPress={() => setMode('record')}
        >
          <Text style={[styles.modeText, mode === 'record' && styles.activeModeText]}>
            🎙️ Record
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'upload' && styles.activeMode]}
          onPress={() => setMode('upload')}
        >
          <Text style={[styles.modeText, mode === 'upload' && styles.activeModeText]}>
            📁 Upload
          </Text>
        </TouchableOpacity>
      </View>

      {mode === 'record' ? (
        <Card variant="elevated" padding="large" style={styles.recordCard}>
          <Text style={styles.recordTitle}>Start Recording</Text>
          <Text style={styles.recordSubtitle}>
            Tap the button below to start recording your conversation
          </Text>

          <MotiView
            from={{ scale: 1 }}
            animate={{ scale: isRecording ? [1, 1.1, 1] : 1 }}
            transition={{ type: 'timing', duration: 1000, loop: isRecording }}
          >
            <TouchableOpacity
              style={[styles.recordButton, isRecording && styles.recordingButton]}
              onPress={() => setIsRecording(!isRecording)}
            >
              <Text style={styles.recordButtonText}>
                {isRecording ? '⏹️' : '🎙️'}
              </Text>
            </TouchableOpacity>
          </MotiView>

          {isRecording && (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing', duration: 300 }}
            >
              <Text style={styles.recordingTime}>00:15</Text>
              <Button
                title="Stop Recording"
                onPress={() => setIsRecording(false)}
                variant="danger"
                fullWidth
              />
            </MotiView>
          )}
        </Card>
      ) : (
        <Card variant="elevated" padding="large" style={styles.uploadCard}>
          <Text style={styles.uploadTitle}>Upload Audio File</Text>
          <Text style={styles.uploadSubtitle}>
            Select an audio file from your device to analyze
          </Text>

          <Button
            title="Choose File"
            onPress={() => console.log('File picker')}
            variant="outline"
            fullWidth
            style={styles.uploadButton}
          />
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Inter',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeMode: {
    backgroundColor: '#4BA3F2',
  },
  modeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  activeModeText: {
    color: '#FFFFFF',
  },
  recordCard: {
    alignItems: 'center',
  },
  recordTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
    marginBottom: 8,
  },
  recordSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter',
    textAlign: 'center',
    marginBottom: 32,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4BA3F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  recordingButton: {
    backgroundColor: '#EF4444',
  },
  recordButtonText: {
    fontSize: 32,
  },
  recordingTime: {
    fontSize: 20,
    fontWeight: '600',
    color: '#EF4444',
    fontFamily: 'Inter',
    marginBottom: 16,
  },
  uploadCard: {
    alignItems: 'center',
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter',
    textAlign: 'center',
    marginBottom: 32,
  },
  uploadButton: {
    marginBottom: 16,
  },
});

export default RecordScreen;