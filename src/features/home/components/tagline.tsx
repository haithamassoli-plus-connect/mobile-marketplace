import Svg, { Path } from 'react-native-svg';

import { Text, View } from '@/components/ui';
import { nav } from '@/features/home/data';

// Tagline + hand-drawn gold underline. Lives in the scrollable content (not the
// fixed navbar) so it scrolls away with the page and only returns at the very
// top — it must not re-appear when a small scroll-up reveals the navbar.
// ponytail: the Figma squiggle is a 987-point vectorized path; this is that path
// downsampled to 16 points and re-smoothed (Catmull-Rom) — same wave, no asset.
export function Tagline() {
  return (
    <View className="items-center bg-secondary-950 py-4">
      {/* Figma: Jost Regular 15/18, white, centered (variant subheadline) */}
      <Text variant="subheadline" className="text-center text-white">
        {nav.tagline}
      </Text>
      <Svg width={234} height={14} viewBox="0 0 234 14.3" className="mt-1">
        <Path
          d="M0 5 C1.2 4.9 3.6 4.9 7.3 4.5 C10.9 4.1 17 3 21.9 2.7 C26.8 2.4 31.6 2.6 36.5 2.5 C41.4 2.5 46.3 2.3 51.2 2.5 C56.1 2.7 60.9 3.2 65.8 3.8 C70.7 4.4 75.5 5.5 80.4 6.2 C85.3 6.9 90.1 7.2 95 7.9 C99.9 8.6 104.8 9.8 109.7 10.5 C114.6 11.1 119.4 11.6 124.3 12 C129.2 12.5 134 13.1 138.9 13.2 C143.8 13.4 148.7 13.5 153.6 12.9 C158.5 12.3 163.3 11.2 168.2 9.8 C173.1 8.5 177.9 6.1 182.8 4.8 C187.7 3.5 192.5 2.4 197.4 1.8 C202.3 1.2 207.2 1.1 212.1 1.2 C217 1.3 223 2.1 226.7 2.4 C230.3 2.7 232.8 2.9 234 3"
          stroke="#DBB42C"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}
