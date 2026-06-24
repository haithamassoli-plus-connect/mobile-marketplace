import type { ComponentProps } from 'react';
import Lucide from '@react-native-vector-icons/lucide';

// Single icon entry point for the home screen. Lucide is registered as an Expo
// config plugin (see app.config.ts), so the font is bundled natively.
// ponytail: thin re-export — gives every section one consistent icon API.
export type IconName = ComponentProps<typeof Lucide>['name'];

export function Icon({
  name,
  size = 24,
  color = '#181d27',
  ...props
}: {
  name: IconName;
  size?: number;
  color?: string;
} & Omit<ComponentProps<typeof Lucide>, 'name' | 'size' | 'color'>) {
  return <Lucide name={name} size={size} color={color} {...props} />;
}
