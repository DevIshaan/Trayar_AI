import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';

// Import components
import { Card, Button } from '@/components/ui';

// Import hooks
import { useAuth } from '@/hooks/useAuth';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    { id: '1', title: 'Edit Profile', icon: '👤', onPress: () => console.log('Edit profile') },
    { id: '2', title: 'Settings', icon: '⚙️', onPress: () => console.log('Settings') },
    { id: '3', title: 'Help & Support', icon: '❓', onPress: () => console.log('Help') },
    { id: '4', title: 'Privacy Policy', icon: '🔒', onPress: () => console.log('Privacy') },
    { id: '5', title: 'Terms of Service', icon: '📄', onPress: () => console.log('Terms') },
    { id: '6', title: 'About', icon: 'ℹ️', onPress: () => console.log('About') },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600 }}
      >
        <Card variant="gradient" gradientColors={['#4BA3F2', '#A8D4F6']} padding="large" style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👨‍⚕️</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'Dr. Johnson'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'dr.johnson@clinic.com'}</Text>
          <Text style={styles.userSpecialization}>{user?.specialization || 'General Dentistry'}</Text>
        </Card>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600, delay: 200 }}
      >
        <Card variant="default" padding="medium" style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Statistics</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>87%</Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3.2h</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>
          </View>
        </Card>
      </MotiView>

      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 600, delay: 400 }}
      >
        <Text style={styles.sectionTitle}>Account</Text>

        {menuItems.slice(0, 3).map((item, index) => (
          <MotiView
            key={item.id}
            from={{ opacity: 0, translateX: 50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 300, delay: 400 + index * 50 }}
          >
            <TouchableOpacity
              onPress={item.onPress}
              style={styles.menuItem}
              accessibilityRole="button"
              accessibilityLabel={item.title}
            >
              <Card variant="default" padding="medium" style={styles.menuCard}>
                <View style={styles.menuContent}>
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </View>
              </Card>
            </TouchableOpacity>
          </MotiView>
        ))}

        <Text style={styles.sectionTitle}>Support</Text>

        {menuItems.slice(3).map((item, index) => (
          <MotiView
            key={item.id}
            from={{ opacity: 0, translateX: 50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 300, delay: 600 + index * 50 }}
          >
            <TouchableOpacity
              onPress={item.onPress}
              style={styles.menuItem}
              accessibilityRole="button"
              accessibilityLabel={item.title}
            >
              <Card variant="default" padding="medium" style={styles.menuCard}>
                <View style={styles.menuContent}>
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </View>
              </Card>
            </TouchableOpacity>
          </MotiView>
        ))}

        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 600, delay: 800 }}
        >
          <Button
            title="Sign Out"
            onPress={handleLogout}
            variant="danger"
            fullWidth
            style={styles.signOutButton}
          />
        </MotiView>
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
  profileCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  userSpecialization: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter',
  },
  statsCard: {
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
    marginBottom: 16,
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
    fontSize: 20,
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
    marginBottom: 12,
    marginTop: 24,
  },
  menuItem: {
    marginBottom: 8,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  menuArrow: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  signOutButton: {
    marginTop: 32,
    marginBottom: 20,
  },
});

export default ProfileScreen;