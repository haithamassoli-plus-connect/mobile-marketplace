import type { VideoSource } from 'expo-video';
import type { StyleProp, ViewStyle } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { withUniwind } from 'uniwind';

const StyledVideoView = withUniwind(VideoView);

export type BackgroundVideoProps = {
  source: VideoSource;
  /** Controlled mute. Defaults to true so autoplay is always allowed. */
  muted?: boolean;
  /** Controlled pause — set true to stop playback (e.g. when the screen blurs). */
  paused?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Looping, autoplaying cover video that fills its parent (muted by default;
 * control with `muted`). Decorative: no native controls and ignores touches.
 * Render a poster (e.g. an <Image />) as a sibling behind it to avoid a black
 * flash while the stream buffers.
 */
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

  // Sync later toggles — the setup callback only runs once, on player creation.
  // Pausing when blurred stops audio + frame decoding so it can't bleed into
  // other screens or burn CPU/battery off-screen.
  React.useEffect(() => {
    // expo-video's player is an external mutable native object; `.muted` and
    // play()/pause() are its documented API, which React Compiler's immutability
    // check can't model.
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
