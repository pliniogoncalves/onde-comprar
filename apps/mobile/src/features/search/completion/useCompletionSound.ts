import { useAudioPlayer } from 'expo-audio';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { AppState } from 'react-native';
import { soundAsset } from './soundAsset';

export function useCompletionSound() {
  const player = useAudioPlayer(soundAsset);
  const generation = useRef(0);
  const stop = useCallback(() => { generation.current++; try { player.pause(); } catch { /* Já liberado. */ } }, [player]);
  const play = useCallback(async () => {
    const current = ++generation.current;
    try {
      if (!player.isLoaded) return false;
      await player.seekTo(0);
      if (current !== generation.current) return false;
      player.loop = false;
      player.play();
      return true;
    } catch { return false; }
  }, [player]);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => { if (state !== 'active') stop(); });
    return () => { subscription.remove(); stop(); };
  }, [stop]);
  return useMemo(() => ({ play, stop }), [play, stop]);
}
