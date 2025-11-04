import React, { useEffect, useState } from 'react';
import { StatusBar, Platform, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import navigation
import { AuthNavigator, AppNavigator } from '@/navigation';

// Import services
import { storageService } from '@/services';

// Import providers
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/components/ui/ThemeContext';

// Import global CSS for NativeWind
import '../src/global.css';

// Ignore specific warnings for this app
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
  'Setting a timer',
]);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check for existing authentication
      const token = await storageService.getAuthToken();
      const user = await storageService.getUser();

      // Validate that both token and user exist
      if (token && user) {
        setIsAuthenticated(true);
      } else {
        // Clear any corrupted auth data
        await storageService.clearAuthTokens();
        await storageService.clearUser();
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      // Ensure clean state on error
      await storageService.clearAuthTokens();
      await storageService.clearUser();
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthChange = (authenticated: boolean) => {
    setIsAuthenticated(authenticated);
  };

  if (isLoading) {
    // Show a simple loading screen while initializing
    return (
      <ThemeProvider>
        <SafeAreaProvider>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#FFFFFF"
            translucent={false}
          />
          <LoadingSplash />
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider onAuthChange={handleAuthChange}>
          <SafeAreaProvider>
            <NavigationContainer>
              <StatusBar
                barStyle="dark-content"
                backgroundColor="#FFFFFF"
                translucent={false}
              />
              {isAuthenticated ? (
                <AppNavigator />
              ) : (
                <AuthNavigator />
              )}
            </NavigationContainer>
          </SafeAreaProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

// Simple loading splash component
const LoadingSplash: React.FC = () => {
  return (
    <MotiView
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 400 }}
    >
      <MotiView
        style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          backgroundColor: '#4BA3F2',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}
        from={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 800 }}
      >
        <Text style={{ fontSize: 40, color: '#FFFFFF' }}>🦷</Text>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 300, duration: 400 }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: '#1F2937',
            fontFamily: 'Inter',
            textAlign: 'center',
          }}
        >
          Trayar
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: '#6B7280',
            fontFamily: 'Inter',
            textAlign: 'center',
            marginTop: 4,
          }}
        >
          Dental Feedback Agent
        </Text>
      </MotiView>

      <MotiView
        style={{ marginTop: 32 }}
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 600, duration: 400 }}
      >
        <Loading size="small" variant="dots" />
      </MotiView>
    </MotiView>
  );
};

// Import MotiView at the top level
import { MotiView } from 'moti';
import { Loading } from '@/components/ui';

export default App;