import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MotiView } from 'moti';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Import components
import { Button, Input, Card } from '@/components/ui';

// Import hooks
import { useAuth } from '@/hooks/useAuth';

// Import types
import { AuthStackParamList } from '@/navigation';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { login, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleInputChange = (field: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
    // Clear global auth error when user starts typing
    if (error) {
      clearError();
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
    } catch (error) {
      // Error is handled by the auth hook
      console.error('Login failed:', error);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Password reset functionality will be available in a future version.',
      [{ text: 'OK' }]
    );
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0, translateY: -50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600 }}
          style={styles.headerContainer}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🦷</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue to Trayar</Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 200 }}
        >
          <Card variant="elevated" padding="large" style={styles.formCard}>
            <View style={styles.formContainer}>
              <Input
                label="Email Address"
                value={formData.email}
                onChangeText={handleInputChange('email')}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={formErrors.email}
                style={styles.input}
                testID="email-input"
                accessibilityLabel="Email address input"
              />

              <Input
                label="Password"
                value={formData.password}
                onChangeText={handleInputChange('password')}
                placeholder="Enter your password"
                secureTextEntry
                showPasswordToggle
                autoComplete="password"
                error={formErrors.password}
                style={styles.input}
                testID="password-input"
                accessibilityLabel="Password input"
              />

              <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotPasswordButton}
                accessibilityRole="button"
                accessibilityLabel="Forgot password"
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {error && (
                <MotiView
                  from={{ opacity: 0, translateY: -10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 300 }}
                >
                  <Card variant="default" padding="medium" style={styles.errorCard}>
                    <Text style={styles.errorText}>{error}</Text>
                  </Card>
                </MotiView>
              )}

              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={isLoading}
                fullWidth
                size="large"
                style={styles.signInButton}
                testID="sign-in-button"
                accessibilityLabel="Sign in button"
              />
            </View>
          </Card>
        </MotiView>

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 600, delay: 400 }}
          style={styles.footerContainer}
        >
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity
            onPress={handleRegister}
            style={styles.signUpButton}
            accessibilityRole="button"
            accessibilityLabel="Sign up for new account"
          >
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#4BA3F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  logo: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    fontFamily: 'Inter',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: 'Inter',
    lineHeight: 24,
  },
  formCard: {
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 20,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#4BA3F2',
    fontFamily: 'Inter',
    fontWeight: '500',
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  signInButton: {
    marginBottom: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter',
    marginRight: 8,
  },
  signUpButton: {
    marginLeft: 4,
  },
  signUpText: {
    fontSize: 14,
    color: '#4BA3F2',
    fontFamily: 'Inter',
    fontWeight: '600',
  },
});

export default LoginScreen;