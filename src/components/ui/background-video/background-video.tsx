import type { VideoSource } from 'expo-video';
import type { StyleProp, ViewStyle } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { withUniwind } from 'uniwind';

const StyledVideoView = withUniwind(VideoView);

export type BackgroundVideoProps = {
  source: VideoSource;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Muted, looping, autoplaying cover video that fills its parent. Decorative:
 * no native controls and ignores touches. Render a poster (e.g. an <Image />)
 * as a sibling behind it to avoid a black flash while the stream buffers.
 */
export function BackgroundVideo({
  source,
  className,
  style,
}: BackgroundVideoProps) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return (
    <StyledVideoView
      player={player}
      contentFit="cover"
      nativeControls={false}
      pointerEvents="none"
      className={className}
      style={[StyleSheet.absoluteFill, style]}
    />
  );
}
