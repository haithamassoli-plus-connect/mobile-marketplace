import { Redirect, Tabs } from 'expo-router';

import { useAuthStore as useAuth } from '@/features/auth';
import { useIsFirstTime } from '@/lib/hooks';

export default function AppLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  if (status === 'signOut') {
    return <Redirect href="/login" />;
  }
  return <Tabs screenOptions={{ headerShown: false }} tabBar={() => null} />;
}
