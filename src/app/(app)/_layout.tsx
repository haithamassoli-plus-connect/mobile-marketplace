import { Redirect, Tabs } from 'expo-router';

import { useAuthStore as useAuth } from '@/features/auth';
import { useIsFirstTime } from '@/lib/hooks';

// Tab group: home, categories, live, cart, profile. The default tab bar is
// hidden — each screen renders the custom floating <BottomNav> instead (it
// routes and, on home, reacts to scroll). The group also guards the
// first-time / auth redirects.
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
