import { Redirect, Tabs } from 'expo-router';
import * as React from 'react';

import { useAuthStore as useAuth } from '@/features/auth';
import { useIsFirstTime } from '@/lib/hooks';

export default function TabLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  if (status === 'signOut') {
    return <Redirect href="/login" />;
  }
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          // Home renders its own floating pill nav (features/home) — hide the default bar.
          tabBarStyle: { display: 'none' },
          tabBarButtonTestID: 'home-tab',
        }}
      />

      <Tabs.Screen
        name="style"
        options={{
          title: 'Style',
          headerShown: false,
          tabBarButtonTestID: 'style-tab',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarButtonTestID: 'settings-tab',
        }}
      />
    </Tabs>
  );
}
