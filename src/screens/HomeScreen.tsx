import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import LinearGradient from 'expo-linear-gradient';

// Import components
import { Button, Card, Loading } from '@/components/ui';

const HomeScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600 }}
      >
        <LinearGradient
          colors={['#4BA3F2', '#7FBFF1']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.userName}>Dr. Johnson</Text>
        </LinearGradient>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600, delay: 200 }}
      >
        <Text style={styles.sectionTitle}>Your Progress</Text>

        <View style={styles.progressCards}>
          <Card variant="elevated" padding="medium" style={styles.progressCard}>
            <Text style={styles.progressTitle}>Empathy</Text>
            <Text style={styles.progressValue}>85%</Text>
          </Card>

          <Card variant="elevated" padding="medium" style={styles.progressCard}>
            <Text style={styles.progressTitle}>Clarity</Text>
            <Text style={styles.progressValue}>92%</Text>
          </Card>

          <Card variant="elevated" padding="medium" style={styles.progressCard}>
            <Text style={styles.progressTitle}>Tone</Text>
            <Text style={styles.progressValue}>78%</Text>
          </Card>

          <Card variant="elevated" padding="medium" style={styles.progressCard}>
            <Text style={styles.progressTitle}>Professionalism</Text>
            <Text style={styles.progressValue}>88%</Text>
          </Card>
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 600, delay: 400 }}
      >
        <Card variant="gradient" gradientColors={['#4BA3F2', '#A8D4F6']} padding="large">
          <Text style={styles.actionTitle}>Ready to improve your skills?</Text>
          <Text style={styles.actionSubtitle}>Start a new session or upload a recording</Text>

          <Button
            title="Start New Session"
            onPress={() => console.log('Navigate to recording')}
            fullWidth
            size="large"
            style={styles.startButton}
          />
        </Card>
      </MotiView>

      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 600, delay: 600 }}
      >
        <Card variant="default" padding="medium" style={styles.statsCard}>
          <Text style={styles.statsTitle}>Recent Activity</Text>
          <Text style={styles.statsText}>• Last session: 2 days ago</Text>
          <Text style={styles.statsText}>• Total sessions: 12</Text>
          <Text style={styles.statsText}>• Average improvement: +15%</Text>
        </Card>
      </MotiView>
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
  headerGradient: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
    marginBottom: 16,
  },
  progressCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  progressCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4BA3F2',
    fontFamily: 'Inter',
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    textAlign: 'center',
    marginBottom: 8,
  },
  actionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter',
    textAlign: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statsCard: {
    marginTop: 24,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
    marginBottom: 12,
  },
  statsText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
});

export default HomeScreen;