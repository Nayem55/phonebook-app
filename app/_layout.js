import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#F5F7FB', // Set background color for all screens
        },
      }}
    />
  );
}