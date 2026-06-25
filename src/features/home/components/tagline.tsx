import Svg, { Path } from 'react-native-svg';

import { Text, View } from '@/components/ui';
import { nav } from '@/features/home/data';

// Tagline + wavy gold underline. Lives in the scrollable content (not the fixed
// navbar) so it scrolls away with the page and only returns at the very top —
// it must not re-appear when a small scroll-up reveals the navbar.
export function Tagline() {
  return (
    <View className="items-center bg-secondary-950 py-4">
      <Text variant="subheadline" className="font-medium text-white">
        {nav.tagline}
      </Text>
      <Svg width={180} height={10} viewBox="0 0 180 10" className="mt-1">
        <Path
          d="M2 6 C 30 0, 60 0, 90 5 S 150 10, 178 4"
          stroke="#DBB42C"
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}
