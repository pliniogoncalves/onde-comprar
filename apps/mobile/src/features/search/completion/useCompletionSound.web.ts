import { Asset } from 'expo-asset';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { soundAsset } from './soundAsset';

// SDK 54 descarta a Promise de HTMLMediaElement.play() no player web.
// Capturá-la aqui evita rejeição não tratada quando autoplay é bloqueado.
export function useCompletionSound() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const prepared = useRef(false);
  const stop = useCallback(() => { audio.current?.pause(); }, []);
  const prepare = useCallback(async () => {
    const element = audio.current;
    if (!element || element.readyState < 2 || !element.paused) return false;
    try {
      if (element.currentTime !== 0) element.currentTime = 0;
      prepared.current = element.readyState >= 2;
      return prepared.current;
    } catch { return false; }
  }, []);
  useEffect(() => {
    const element = new Audio(Asset.fromModule(soundAsset).uri);
    element.preload = 'auto';
    element.loop = false;
    audio.current = element;
    const loaded = () => { void prepare(); };
    element.addEventListener('canplay', loaded);
    element.load();
    const visibility = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', visibility);
    return () => { stop(); element.removeEventListener('canplay', loaded); element.removeAttribute('src'); element.load(); audio.current = null; prepared.current = false; document.removeEventListener('visibilitychange', visibility); };
  }, [stop, prepare]);
  const play = useCallback(async () => {
    try {
      if (!audio.current || !prepared.current || audio.current.readyState < 2) return false;
      prepared.current = false;
      await audio.current.play();
      return true;
    } catch { return false; }
  }, []);
  const info = useCallback(() => ({ durationMs: Number.isFinite(audio.current?.duration) ? audio.current!.duration * 1000 : 0, prepared: prepared.current }), []);
  return useMemo(() => ({ play, stop, prepare, info }), [play, stop, prepare, info]);
}
