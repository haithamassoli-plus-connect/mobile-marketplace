import { useLocalSearchParams } from 'expo-router';

import { product } from '@/features/product/data';
import { ProductScreen } from '@/features/product/product-screen';

export default function ProductRoute() {
  // Guard the param: the screen may be opened without one (e.g. a deep link),
  // so fall back to the static product id rather than rendering `pdp-undefined`.
  const { id } = useLocalSearchParams<{ id?: string }>();
  return <ProductScreen id={id ?? product.id} />;
}
