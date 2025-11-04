import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MotiView } from 'moti';

// Import components
import { Card, Button } from '@/components/ui';

const SessionScreen: React.FC = () => {
  const mockTranscript = `Dr. Johnson: Good morning! How are you feeling today?

Patient: I've been having some pain in my lower right molar for the past few days.

Dr. Johnson: I see. Can you tell me more about the pain? Is it constant or does it come and go?

Patient: It's mostly when I chew, and sometimes it wakes me up at night.

Dr. Johnson: Thank you for that information. Let me take a look at what's going on...`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Session Review</Text>
        <Text style={styles.subtitle}>Review and analyze your conversation</Text>
      </View>

      <Card variant="default" padding="medium" style={styles.audioCard}>
        <Text style={styles.audioTitle}>🎵 Audio Recording</Text>
        <View style={styles.audioControls}>
          <Button
            title="▶️ Play"
            onPress={() => console.log('Play audio')}
            variant="secondary"
            size="small"
          />
          <View style={styles.audioProgress}>
            <Text style={styles.audioTime}>00:00 / 15:32</Text>
          </View>
        </View>
      </Card>

      <Card variant="elevated" padding="large" style={styles.transcriptCard}>
        <Text style={styles.transcriptTitle}>📝 Transcript</Text>
        <ScrollView style={styles.transcriptScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.transcriptText}>{mockTranscript}</Text>
        </ScrollView>
      </Card>

      <View style={styles.actionButtons}>
        <Button
          title="🧠 Generate AI Feedback"
          onPress={() => console.log('Generate feedback')}
          fullWidth
          size="large"
          style={styles.feedbackButton}
        />
        <Button
          title="💾 Save Session"
          onPress={() => console.log('Save session')}
          variant="outline"
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  audioCard: {
    marginBottom: 20,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
    marginBottom: 12,
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioProgress: {
    flex: 1,
    marginLeft: 16,
  },
  audioTime: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  transcriptCard: {
    marginBottom: 24,
    minHeight: 300,
  },
  transcriptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
    marginBottom: 16,
  },
  transcriptScroll: {
    maxHeight: 200,
  },
  transcriptText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
    fontFamily: 'Inter',
  },
  actionButtons: {
    gap: 12,
  },
  feedbackButton: {
    marginBottom: 8,
  },
});

export default SessionScreen;