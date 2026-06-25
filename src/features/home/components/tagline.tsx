import Svg, { Path } from 'react-native-svg';

import { Text, View } from '@/components/ui';
import { nav } from '@/features/home/data';

// Tagline + hand-drawn gold underline. Lives in the scrollable content (not the
// fixed navbar) so it scrolls away with the page and only returns at the very
// top — it must not re-appear when a small scroll-up reveals the navbar.
// ponytail: the Figma squiggle is a 200+ point vectorized path; a single cubic
// bezier reproduces the same gentle two-hump wave at our size with no asset.
export function Tagline() {
  return (
    <View className="items-center bg-secondary-950 py-4">
      {/* Figma: Jost Regular 15/18, white, centered (variant subheadline) */}
      <Text variant="subheadline" className="text-center text-white">
        {nav.tagline}
      </Text>
      <Svg width={234} height={12} viewBox="0 0 234 12" className="mt-1">
        <Path
          d="M1 5 C 40 1, 70 9, 110 6 S 190 1, 233 5"
          stroke="#DBB42C"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}
