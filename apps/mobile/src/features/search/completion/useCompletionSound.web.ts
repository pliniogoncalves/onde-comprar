import { Asset } from 'expo-asset';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { soundAsset } from './soundAsset';

// SDK 54 descarta a Promise de HTMLMediaElement.play() no player web.
// Capturá-la aqui evita rejeição não tratada quando autoplay é bloqueado.
export function useCompletionSound() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const stop = useCallback(() => { audio.current?.pause(); }, []);
  useEffect(() => {
    const element = new Audio(Asset.fromModule(soundAsset).uri);
    element.preload = 'auto';
    element.loop = false;
    audio.current = element;
    const visibility = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', visibility);
    return () => { stop(); element.removeAttribute('src'); element.load(); audio.current = null; document.removeEventListener('visibilitychange', visibility); };
  }, [stop]);
  const play = useCallback(async () => {
    try {
      if (!audio.current) return false;
      audio.current.currentTime = 0;
      await audio.current.play();
      return true;
    } catch { return false; }
  }, []);
  return useMemo(() => ({ play, stop }), [play, stop]);
}
