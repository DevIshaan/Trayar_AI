import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Alert } from 'react-native';

// Import types
import { User, AuthState, LoginCredentials, RegisterCredentials } from '@/types';

// Import services
import { apiService, storageService } from '@/services';

// Import navigation
import { navigate } from '@/navigation';

// Import components
import { Loading } from '@/components/ui';

// Auth Context Type
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
  onAuthChange?: (isAuthenticated: boolean) => void;
}

// Initial Auth State
const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  onAuthChange,
}) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const token = await storageService.getAuthToken();
      const user = await storageService.getUser();

      if (token && user) {
        // Verify token is still valid by making a lightweight API call
        try {
          await apiService.healthCheck();
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          onAuthChange?.(true);
        } catch (error) {
          // Token is invalid, clear auth data
          await storageService.clearAuthTokens();
          await storageService.clearUser();
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Session expired. Please log in again.',
          });
          onAuthChange?.(false);
        }
      } else {
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        onAuthChange?.(false);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to initialize authentication',
      });
      onAuthChange?.(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await apiService.post('/auth/login', credentials);

      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data;

        // Store auth data
        await storageService.setAuthToken(token);
        if (refreshToken) {
          await storageService.setRefreshToken(refreshToken);
        }
        await storageService.setUser(user);

        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        onAuthChange?.(true);
      } else {
        throw new Error(response.error?.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      onAuthChange?.(false);
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await apiService.post('/auth/register', credentials);

      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data;

        // Store auth data
        await storageService.setAuthToken(token);
        if (refreshToken) {
          await storageService.setRefreshToken(refreshToken);
        }
        await storageService.setUser(user);

        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        onAuthChange?.(true);
      } else {
        throw new Error(response.error?.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      onAuthChange?.(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Call logout endpoint if available
      try {
        await apiService.post('/auth/logout');
      } catch (error) {
        // Continue with local logout even if API call fails
        console.warn('Logout API call failed:', error);
      }

      // Clear local storage
      await storageService.clearAuthTokens();
      await storageService.clearUser();
      await storageService.clearCache();

      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      onAuthChange?.(false);

      // Navigate to login screen
      navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Force logout even if there's an error
      await storageService.clearAuthTokens();
      await storageService.clearUser();

      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      onAuthChange?.(false);
      navigate('Login');
    }
  };

  const refreshUser = async () => {
    try {
      if (!authState.token) return;

      const response = await apiService.get('/auth/profile');

      if (response.success && response.data) {
        const updatedUser = response.data;
        await storageService.setUser(updatedUser);

        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
          error: null,
        }));
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // Don't update auth state on refresh error
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await apiService.put('/auth/profile', userData);

      if (response.success && response.data) {
        const updatedUser = response.data;
        await storageService.setUser(updatedUser);

        setAuthState(prev => ({
          ...prev,
          user: prev.user ? { ...prev.user, ...updatedUser } : null,
          isLoading: false,
          error: null,
        }));
      } else {
        throw new Error(response.error?.message || 'Failed to update profile');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook to get authentication status
export const useAuthStatus = () => {
  const { isAuthenticated, isLoading, error } = useAuth();
  return { isAuthenticated, isLoading, error };
};

// Hook to get current user
export const useCurrentUser = () => {
  const { user, updateUser, refreshUser } = useAuth();
  return { user, updateUser, refreshUser };
};

// Higher-order component for protected routes
export const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return <Loading fullscreen />;
    }

    if (!isAuthenticated) {
      // Redirect to login
      useEffect(() => {
        navigate('Login');
      }, []);
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default AuthContext;