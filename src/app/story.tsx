import { useLocalSearchParams } from 'expo-router';

import { StoryViewer } from '@/features/home/components/story-viewer';

export default function StoryRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <StoryViewer startId={id} />;
}
