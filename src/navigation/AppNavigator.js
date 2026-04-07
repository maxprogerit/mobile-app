import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import DayScreen from '../screens/DayScreen';
import AddMoodScreen from '../screens/AddMoodScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../utils/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.text,
  headerShadowVisible: false,
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mood Tracker' }} />
      <Stack.Screen name="Day" component={DayScreen} options={({ route }) => ({ title: route.params?.date || 'Day' })} />
      <Stack.Screen name="AddMood" component={AddMoodScreen} options={{ title: 'Log Mood' }} />
    </Stack.Navigator>
  );
}

function TabIcon({ label, focused }) {
  const icons = { Home: '📅', AddMood: '＋', Profile: '👤' };
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
      {icons[label] || '•'}
    </Text>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ focused }) => (
          <TabIcon label={route.name} focused={focused} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ title: 'Calendar' }} />
      <Tab.Screen
        name="AddMood"
        component={AddMoodScreen}
        options={{ title: 'Log', headerShown: true, ...screenOptions, headerTitle: 'Log Mood' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true, ...screenOptions, headerTitle: 'Profile' }} />
    </Tab.Navigator>
  );
}
