import type { ComponentProps } from 'react';
import Lucide from '@react-native-vector-icons/lucide';

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
