import React, { useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MotiView } from 'moti';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from '@/screens/HomeScreen';
import RecordScreen from '@/screens/RecordScreen';
import SessionScreen from '@/screens/SessionScreen';
import FeedbackScreen from '@/screens/FeedbackScreen';
import HistoryScreen from '@/screens/HistoryScreen';
import ProfileScreen from '@/screens/ProfileScreen';

// Import components
import { TabBarIcon } from '@/components/ui';

// Import types
import { RootStackParamList, AppTabParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<AppTabParamList>();

// Custom tab bar component
const CustomTabBar: React.FC<any> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <MotiView
      style={[
        styles.tabBarContainer,
        {
          paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
        },
      ]}
      from={{ translateY: 100 }}
      animate={{ translateY: 0 }}
      transition={{ type: 'timing', duration: 300 }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel as string;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <MotiView
            key={route.key}
            style={styles.tabItem}
            animate={{
              scale: isFocused ? 1.1 : 1,
              opacity: isFocused ? 1 : 0.7,
            }}
            transition={{ type: 'timing', duration: 200 }}
          >
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <TabBarIcon
                name={route.name}
                size={24}
                color={isFocused ? '#4BA3F2' : '#9CA3AF'}
              />
            </TouchableOpacity>
          </MotiView>
        );
      })}
    </MotiView>
  );
};

// Tab Navigator Component
const AppTabs: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          display: 'none',
        },
        lazy: true,
        unmountOnBlur: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
        }}
      />
      <Tab.Screen
        name="Record"
        component={RecordScreen}
        options={{
          tabBarLabel: 'Record',
          tabBarAccessibilityLabel: 'Record tab',
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
          tabBarAccessibilityLabel: 'History tab',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarAccessibilityLabel: 'Profile tab',
        }}
      />
    </Tab.Navigator>
  );
};

// Main Stack Navigator Component
const AppNavigator: React.FC = () => {
  const navigationRef = useRef<any>(null);

  return (
    <MotiView
      style={styles.container}
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 400 }}
    >
      <Stack.Navigator
        ref={navigationRef}
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyle: { backgroundColor: '#FFFFFF' },
          cardOverlayEnabled: false,
          detachPreviousScreen: false,
          // Custom transition animations
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 300,
                useNativeDriver: true,
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 250,
                useNativeDriver: true,
              },
            },
          },
          cardStyleInterpolator: ({ current, next, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
              overlayStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            };
          },
          headerStyleInterpolator: ({ current, next, layouts }) => {
            return {
              leftLabelStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
              rightLabelStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-layouts.screen.width, 0],
                    }),
                  },
                ],
              },
              titleStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            };
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={AppTabs}
          options={{
            gestureEnabled: false,
            animationEnabled: false,
          }}
        />
        <Stack.Screen
          name="Session"
          component={SessionScreen}
          options={{
            gestureEnabled: true,
            animationTypeForReplace: 'push',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="Feedback"
          component={FeedbackScreen}
          options={{
            gestureEnabled: true,
            animationTypeForReplace: 'push',
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    // Add subtle background for focused tab
    backgroundColor: 'transparent',
  },
});

// Export navigation ref for use throughout the app
export const navigationRef = React.createRef<any>();

export const navigate = (name: string, params?: any) => {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
};

export const goBack = () => {
  if (navigationRef.current) {
    navigationRef.current.goBack();
  }
};

export default AppNavigator;