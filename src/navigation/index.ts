// Export navigation components
export { default as AuthNavigator } from './AuthNavigator';
export { default as AppNavigator, navigationRef, navigate, goBack } from './AppNavigator';

// Export types
export type {
  RootStackParamList,
  AuthStackParamList,
  AppTabParamList,
  AuthStackNavigationProp,
  RootStackNavigationProp,
  AppTabNavigationProp,
  useAuthNavigationProp,
  useAppNavigationProp,
  useTabNavigationProp,
  NavigationProp,
  Route,
  TabRoute,
  NavigationState,
  TabNavigationState,
  DeepLinkingConfig,
  NavigationEvent,
  NavigationContainerRef,
  NavigationAnimationConfig,
  GestureConfig,
  ScreenOptions,
  TabOptions,
} from './types';

// Re-export navigation hooks from React Navigation
export {
  useNavigation,
  useRoute,
  useFocusEffect,
  useIsFocused,
  useNavigationState,
  useNavigationContainerRef,
} from '@react-navigation/native';

export {
  createStackNavigator,
  CardStyleInterpolators,
  HeaderStyleInterpolators,
  TransitionPresets,
} from '@react-navigation/stack';

export {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';