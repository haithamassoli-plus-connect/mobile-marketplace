import type { VideoSource } from 'expo-video';
import type { StyleProp, ViewStyle } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { withUniwind } from 'uniwind';

const StyledVideoView = withUniwind(VideoView);

export type BackgroundVideoProps = {
  source: VideoSource;
  muted?: boolean;
  paused?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function BackgroundVideo({
  source,
  muted = true,
  paused = false,
  className,
  style,
}: BackgroundVideoProps) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = muted;
    p.play();
  });

  React.useEffect(() => {
    /* eslint-disable react-hooks/immutability, react-compiler/react-compiler */
    player.muted = muted;
    if (paused)
      player.pause();
    else
      player.play();
    /* eslint-enable react-hooks/immutability, react-compiler/react-compiler */
  }, [player, muted, paused]);

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
