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

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  specialization?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  specialization?: string;
}

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { register, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: '',
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

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        specialization: formData.specialization.trim() || undefined,
      });
    } catch (error) {
      // Error is handled by the auth hook
      console.error('Registration failed:', error);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Trayar to improve your dental communication</Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 200 }}
        >
          <Card variant="elevated" padding="large" style={styles.formCard}>
            <View style={styles.formContainer}>
              <Input
                label="Full Name"
                value={formData.name}
                onChangeText={handleInputChange('name')}
                placeholder="Enter your full name"
                autoCapitalize="words"
                autoComplete="name"
                error={formErrors.name}
                style={styles.input}
                testID="name-input"
                accessibilityLabel="Full name input"
              />

              <Input
                label="Email Address"
                value={formData.email}
                onChangeText={handleInputChange('email')}
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={formErrors.email}
                style={styles.input}
                testID="email-input"
                accessibilityLabel="Email address input"
              />

              <Input
                label="Specialization (Optional)"
                value={formData.specialization}
                onChangeText={handleInputChange('specialization')}
                placeholder="e.g., General Dentistry, Orthodontics"
                autoCapitalize="words"
                error={formErrors.specialization}
                style={styles.input}
                testID="specialization-input"
                accessibilityLabel="Specialization input"
              />

              <Input
                label="Password"
                value={formData.password}
                onChangeText={handleInputChange('password')}
                placeholder="Create a strong password"
                secureTextEntry
                showPasswordToggle
                autoComplete="password"
                error={formErrors.password}
                helperText="Must contain uppercase, lowercase, and number"
                style={styles.input}
                testID="password-input"
                accessibilityLabel="Password input"
              />

              <Input
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={handleInputChange('confirmPassword')}
                placeholder="Confirm your password"
                secureTextEntry
                showPasswordToggle
                autoComplete="password"
                error={formErrors.confirmPassword}
                style={styles.input}
                testID="confirm-password-input"
                accessibilityLabel="Confirm password input"
              />

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
                title="Create Account"
                onPress={handleRegister}
                loading={isLoading}
                fullWidth
                size="large"
                style={styles.signUpButton}
                testID="create-account-button"
                accessibilityLabel="Create account button"
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
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.loginButton}
            accessibilityRole="button"
            accessibilityLabel="Sign in to existing account"
          >
            <Text style={styles.loginText}>Sign In</Text>
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
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
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
    marginBottom: 16,
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
  signUpButton: {
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
  loginButton: {
    marginLeft: 4,
  },
  loginText: {
    fontSize: 14,
    color: '#4BA3F2',
    fontFamily: 'Inter',
    fontWeight: '600',
  },
});

export default RegisterScreen;