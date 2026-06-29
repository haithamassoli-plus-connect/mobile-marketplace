import { useLocalSearchParams } from 'expo-router';

import { product } from '@/features/product/data';
import { ProductScreen } from '@/features/product/product-screen';

export default function ProductRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return <ProductScreen id={id ?? product.id} />;
}
