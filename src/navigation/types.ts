import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Stack Navigator Types
export type RootStackParamList = {
  AuthStack: undefined;
  MainTabs: undefined;
  Session: {
    sessionId?: string;
    audioUri?: string;
    isNewRecording?: boolean;
  };
  Feedback: {
    sessionId: string;
    transcript: string;
    feedbackId?: string;
  };
  // Add more stack screens as needed
};

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
};

// Tab Navigator Types
export type AppTabParamList = {
  Home: undefined;
  Record: {
    mode?: 'record' | 'upload';
  };
  History: {
    sessionId?: string;
  };
  Profile: {
    edit?: boolean;
  };
};

// Navigation Prop Types
export type AuthStackNavigationProp = StackNavigationProp<AuthStackParamList>;
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
export type AppTabNavigationProp = BottomTabNavigationProp<AppTabParamList>;

// Hook Types
export type useAuthNavigationProp = () => AuthStackNavigationProp;
export type useAppNavigationProp = () => RootStackNavigationProp;
export type useTabNavigationProp = () => AppTabNavigationProp;

// Generic Navigation Type
export type NavigationProp<T extends keyof RootStackParamList> = StackNavigationProp<
  RootStackParamList,
  T
>;

// Screen Options Types
export interface ScreenOptions {
  title?: string;
  headerShown?: boolean;
  headerTitle?: string;
  headerLeft?: any;
  headerRight?: any;
  headerStyle?: any;
  headerTitleStyle?: any;
  headerTintColor?: string;
  gestureEnabled?: boolean;
  animationTypeForReplace?: 'push' | 'pop';
}

// Tab Options Types
export interface TabOptions {
  tabBarLabel?: string;
  tabBarIcon?: any;
  tabBarAccessibilityLabel?: string;
  tabBarTestID?: string;
}

// Route Types
export interface Route<T extends keyof RootStackParamList = keyof RootStackParamList> {
  key: string;
  name: T;
  params?: RootStackParamList[T];
  path?: string;
}

export interface TabRoute<T extends keyof AppTabParamList = keyof AppTabParamList> {
  key: string;
  name: T;
  params?: AppTabParamList[T];
  path?: string;
}

// Navigation State Types
export interface NavigationState {
  index: number;
  routes: Route[];
  history?: Route[];
  key?: string;
  routeNames: string[];
  type?: string;
}

export interface TabNavigationState {
  index: number;
  routes: TabRoute[];
  history?: TabRoute[];
  key?: string;
  routeNames: string[];
  type?: string;
}

// Deep Linking Types
export interface DeepLinkingConfig {
  prefixes: string[];
  config: {
    screens: {
      [key: string]: string | {
        path: string;
        parse?: (params: any) => any;
        stringify?: (params: any) => string;
        screens?: {
          [key: string]: string | {
            path: string;
            parse?: (params: any) => any;
            stringify?: (params: any) => string;
          };
        };
      };
    };
  };
}

// Navigation Event Types
export interface NavigationEvent {
  type: string;
  data?: any;
  canPreventDefault?: boolean;
  defaultPrevented?: boolean;
}

// Navigation Container Ref Types
export interface NavigationContainerRef {
  navigate: (name: string, params?: any) => void;
  goBack: () => void;
  resetRoot: (state?: Partial<NavigationState>) => void;
  isReady: () => boolean;
  getCurrentRoute: () => Route | undefined;
  addListener: (type: string, listener: (event: NavigationEvent) => void) => () => void;
  removeListener: (type: string, listener: (event: NavigationEvent) => void) => void;
  dispatch: (action: any) => void;
}

// Animation Types
export interface NavigationAnimationConfig {
  open: {
    animation: 'timing' | 'spring';
    config: {
      duration?: number;
      useNativeDriver?: boolean;
      [key: string]: any;
    };
  };
  close: {
    animation: 'timing' | 'spring';
    config: {
      duration?: number;
      useNativeDriver?: boolean;
      [key: string]: any;
    };
  };
}

// Gesture Types
export interface GestureConfig {
  enabled?: boolean;
  gestureDirection?: 'horizontal' | 'vertical';
  gestureVelocityImpact?: number;
}