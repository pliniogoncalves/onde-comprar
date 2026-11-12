import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { AppState } from 'react-native';
import { soundAsset } from './soundAsset';

export function useCompletionSound() {
  const player = useAudioPlayer(soundAsset);
  const status = useAudioPlayerStatus(player);
  const generation = useRef(0);
  const prepared = useRef(false);
  const stop = useCallback(() => { generation.current++; prepared.current = false; try { player.pause(); } catch { /* Já liberado. */ } }, [player]);
  const prepare = useCallback(async () => {
    const current = ++generation.current;
    try {
      if (!player.isLoaded || player.playing) return false;
      await player.seekTo(0);
      if (current !== generation.current) return false;
      prepared.current = true;
      return true;
    } catch { return false; }
  }, [player]);
  useEffect(() => { if (status.isLoaded) void prepare(); }, [status.isLoaded, prepare]);
  const play = useCallback(async () => {
    try {
      if (!player.isLoaded || !prepared.current) return false;
      prepared.current = false;
      player.loop = false;
      player.play();
      return true;
    } catch { return false; }
  }, [player]);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => { if (state !== 'active') stop(); });
    return () => { subscription.remove(); stop(); };
  }, [stop]);
  const info = useCallback(() => ({ durationMs: Number.isFinite(player.duration) ? player.duration * 1000 : 0, prepared: prepared.current }), [player]);
  return useMemo(() => ({ play, stop, prepare, info }), [play, stop, prepare, info]);
}
