import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import LinearGradient from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Import types
import { AuthStackParamList } from '@/navigation';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Splash'>;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const mountedRef = useRef(true);

  useEffect(() => {
    const initializeApp = async () => {
      // Simulate app initialization
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Navigate to login screen
      if (mountedRef.current) {
        navigation.replace('Login');
      }
    };

    initializeApp();

    return () => {
      mountedRef.current = false;
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4BA3F2', '#A8D4F6', '#FFFFFF']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <MotiView
        style={styles.contentContainer}
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 800 }}
      >
        <MotiView
          style={styles.logoContainer}
          from={{ scale: 0, rotate: '180deg' }}
          animate={{ scale: 1, rotate: '0deg' }}
          transition={{
            type: 'spring',
            duration: 1200,
            damping: 10,
            stiffness: 100,
          }}
        >
          <View style={styles.logo}>
            <Text style={styles.logoText}>🦷</Text>
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: 'timing',
            duration: 800,
            delay: 600,
          }}
        >
          <Text style={styles.appName}>Trayar</Text>
          <Text style={styles.tagline}>Dental Feedback Agent</Text>
        </MotiView>
      </MotiView>

      <MotiView
        style={styles.loadingContainer}
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 800,
          delay: 1200,
        }}
      >
        <MotiView
          style={styles.loadingDots}
          from={{ scale: 0.8, opacity: 0.4 }}
          animate={[
            { scale: 1.2, opacity: 1 },
            { scale: 0.8, opacity: 0.4 },
          ]}
          transition={{
            type: 'timing',
            duration: 1200,
            loop: true,
            repeatReverse: true,
          }}
        >
          <View style={styles.dot} />
        </MotiView>
        <MotiView
          style={styles.loadingDots}
          from={{ scale: 0.8, opacity: 0.4 }}
          animate={[
            { scale: 1.2, opacity: 1 },
            { scale: 0.8, opacity: 0.4 },
          ]}
          transition={{
            type: 'timing',
            duration: 1200,
            loop: true,
            repeatReverse: true,
            delay: 200,
          }}
        >
          <View style={styles.dot} />
        </MotiView>
        <MotiView
          style={styles.loadingDots}
          from={{ scale: 0.8, opacity: 0.4 }}
          animate={[
            { scale: 1.2, opacity: 1 },
            { scale: 0.8, opacity: 0.4 },
          ]}
          transition={{
            type: 'timing',
            duration: 1200,
            loop: true,
            repeatReverse: true,
            delay: 400,
          }}
        >
          <View style={styles.dot} />
        </MotiView>
      </MotiView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '80%',
  },
  logoContainer: {
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 20,
  },
  logoText: {
    fontSize: 60,
    textAlign: 'center',
  },
  appName: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Inter',
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontFamily: 'Inter',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 100,
  },
  loadingDots: {
    marginHorizontal: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
});

export default SplashScreen;