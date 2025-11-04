import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { MotiView } from 'moti';

// Import components
import { Card, Button } from '@/components/ui';

const HistoryScreen: React.FC = () => {
  const mockSessions = [
    {
      id: '1',
      date: '2024-01-15',
      title: 'Patient Consultation',
      duration: '15:32',
      score: 85,
    },
    {
      id: '2',
      date: '2024-01-12',
      title: 'Treatment Planning',
      duration: '22:18',
      score: 92,
    },
    {
      id: '3',
      date: '2024-01-08',
      title: 'Follow-up Visit',
      duration: '12:45',
      score: 78,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Session History</Text>
        <Text style={styles.subtitle}>Your past conversation analyses</Text>
      </View>

      <Card variant="default" padding="medium" style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>87%</Text>
            <Text style={styles.statLabel}>Average Score</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>+12%</Text>
            <Text style={styles.statLabel}>Improvement</Text>
          </View>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Recent Sessions</Text>

      <FlatList
        data={mockSessions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <MotiView
            from={{ opacity: 0, translateX: 50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 400, delay: index * 100 }}
          >
            <Card variant="elevated" padding="medium" style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View>
                  <Text style={styles.sessionTitle}>{item.title}</Text>
                  <Text style={styles.sessionDate}>{item.date}</Text>
                </View>
                <View style={styles.sessionScore}>
                  <Text style={styles.scoreValue}>{item.score}%</Text>
                </View>
              </View>
              <View style={styles.sessionFooter}>
                <Text style={styles.sessionDuration}>⏱️ {item.duration}</Text>
                <Button
                  title="View Details"
                  onPress={() => console.log('View session details')}
                  variant="outline"
                  size="small"
                />
              </View>
            </Card>
          </MotiView>
        )}
      />
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
  statsCard: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4BA3F2',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
    marginBottom: 16,
  },
  sessionCard: {
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  sessionScore: {
    backgroundColor: '#4BA3F2',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  sessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionDuration: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
});

export default HistoryScreen;