import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MotiView } from 'moti';

// Import components
import { Card, Button } from '@/components/ui';

const FeedbackScreen: React.FC = () => {
  const raiseFeedback = {
    recognize: "You showed excellent active listening by acknowledging the patient's pain and asking specific follow-up questions.",
    assess: "Your tone was professional yet caring. You explained the examination process clearly, which helped reduce patient anxiety.",
    identify: "Consider providing more specific information about potential treatment options and their timelines.",
    shape: "Try to use simpler terminology when explaining dental procedures. Consider asking patients what they already know about their condition.",
    establish: "Focus on building rapport through shared decision-making. Set goals for improving patient education and communication clarity.",
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Feedback</Text>
        <Text style={styles.subtitle}>RAISE Model Analysis</Text>
      </View>

      <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: 'timing', duration: 600 }}
      >
        <Card variant="gradient" gradientColors={['#22C55E', '#86EFAC']} padding="large" style={styles.raiseCard}>
          <View style={styles.raiseHeader}>
            <Text style={styles.raiseLetter}>R</Text>
            <View style={styles.raiseTitleContainer}>
              <Text style={styles.raiseTitle}>Recognize</Text>
              <Text style={styles.raiseSubtitle}>Positive behaviors</Text>
            </View>
          </View>
          <Text style={styles.raiseContent}>{raiseFeedback.recognize}</Text>
        </Card>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: 'timing', duration: 600, delay: 100 }}
      >
        <Card variant="gradient" gradientColors={['#4BA3F2', '#93C5FD']} padding="large" style={styles.raiseCard}>
          <View style={styles.raiseHeader}>
            <Text style={styles.raiseLetter}>A</Text>
            <View style={styles.raiseTitleContainer}>
              <Text style={styles.raiseTitle}>Assess</Text>
              <Text style={styles.raiseSubtitle}>Clarity & tone evaluation</Text>
            </View>
          </View>
          <Text style={styles.raiseContent}>{raiseFeedback.assess}</Text>
        </Card>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: 'timing', duration: 600, delay: 200 }}
      >
        <Card variant="gradient" gradientColors={['#F59E0B', '#FDE047']} padding="large" style={styles.raiseCard}>
          <View style={styles.raiseHeader}>
            <Text style={styles.raiseLetter}>I</Text>
            <View style={styles.raiseTitleContainer}>
              <Text style={styles.raiseTitle}>Identify</Text>
              <Text style={styles.raiseSubtitle}>Areas for improvement</Text>
            </View>
          </View>
          <Text style={styles.raiseContent}>{raiseFeedback.identify}</Text>
        </Card>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: 'timing', duration: 600, delay: 300 }}
      >
        <Card variant="gradient" gradientColors={['#EF4444', '#FCA5A5']} padding="large" style={styles.raiseCard}>
          <View style={styles.raiseHeader}>
            <Text style={styles.raiseLetter}>S</Text>
            <View style={styles.raiseTitleContainer}>
              <Text style={styles.raiseTitle}>Shape</Text>
              <Text style={styles.raiseSubtitle}>Actionable improvements</Text>
            </View>
          </View>
          <Text style={styles.raiseContent}>{raiseFeedback.shape}</Text>
        </Card>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: 'timing', duration: 600, delay: 400 }}
      >
        <Card variant="gradient" gradientColors={['#8B5CF6', '#C4B5FD']} padding="large" style={styles.raiseCard}>
          <View style={styles.raiseHeader}>
            <Text style={styles.raiseLetter}>E</Text>
            <View style={styles.raiseTitleContainer}>
              <Text style={styles.raiseTitle}>Establish</Text>
              <Text style={styles.raiseSubtitle}>Long-term goals</Text>
            </View>
          </View>
          <Text style={styles.raiseContent}>{raiseFeedback.establish}</Text>
        </Card>
      </MotiView>

      <Card variant="elevated" padding="large" style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Overall Score</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreValue}>87%</Text>
          <Text style={styles.scoreLabel}>Excellent Performance</Text>
        </View>
      </Card>

      <View style={styles.actionButtons}>
        <Button
          title="💾 Save Feedback"
          onPress={() => console.log('Save feedback')}
          fullWidth
          style={styles.saveButton}
        />
        <Button
          title="📊 View Details"
          onPress={() => console.log('View details')}
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
  raiseCard: {
    marginBottom: 16,
  },
  raiseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  raiseLetter: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    textAlign: 'center',
    lineHeight: 48,
  },
  raiseTitleContainer: {
    flex: 1,
  },
  raiseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  raiseSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter',
  },
  raiseContent: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.95)',
    fontFamily: 'Inter',
  },
  summaryCard: {
    alignItems: 'center',
    marginVertical: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
    marginBottom: 16,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#4BA3F2',
    fontFamily: 'Inter',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  actionButtons: {
    gap: 12,
    marginTop: 24,
  },
  saveButton: {
    marginBottom: 8,
  },
});

export default FeedbackScreen;