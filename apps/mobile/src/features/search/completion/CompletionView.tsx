import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, useFocusEffect } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Animated, AppState, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../theme';
import { confirmationTiming } from '../../../config/demoTiming';
import { usePreferences } from '../../preferences/PreferencesProvider';
import { useDemo } from '../DemoProvider';
import { useReducedMotion } from './useReducedMotion';

export function CompletionView() {
  const { state, session, sound } = useDemo();
  const { preferences, ready } = usePreferences();
  const reducedMotion = useReducedMotion();
  const focused = useIsFocused();
  const [foreground, setForeground] = useState(AppState.currentState === 'active');
  const [success, setSuccess] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const id = state.completionId;
  const preferencesRef = useRef(preferences);
  preferencesRef.current = preferences;
  useEffect(() => {
    const subscription = AppState.addEventListener('change', value => setForeground(value === 'active'));
    return () => subscription.remove();
  }, []);
  useFocusEffect(useCallback(() => {
    if (!id || !foreground || !ready || reducedMotion === null || state.phase !== 'complete') return;
    void sound.prepare();
    const detach = session.confirmation.attach(id, reducedMotion, preferencesRef.current.soundEnabled ? sound.info().durationMs : 0,
      setSuccess, () => {
        if (session.getSnapshot().completionId !== id || session.getSnapshot().phase !== 'complete') return;
        // A guarda de rota abaixo é a única responsável pela navegação.
        session.results(id);
      });
    return () => { detach(); sound.stop(); scale.stopAnimation(); scale.setValue(1); };
  }, [id, foreground, ready, reducedMotion, state.phase, session, sound, scale]));

  // O texto e o check entram no mesmo commit em que se tenta reproduzir áudio.
  // Preparação/seek já ocorreram antes, fora deste marco visual.
  useLayoutEffect(() => {
    if (!success || !focused || !foreground || !id || !ready || reducedMotion === null) return;
    const plan = session.completion.claim(id, 'success', preferencesRef.current, state.offers.length);
    if (!plan) return;
    if (!reducedMotion) {
      scale.setValue(0.88);
      Animated.timing(scale, { toValue: 1, duration: confirmationTiming.animationMs, useNativeDriver: true }).start();
    }
    if (plan.playSound) void sound.play();
  }, [success, focused, foreground, id, ready, reducedMotion, session, sound, scale, state.offers.length]);

  if (state.phase !== 'complete' || !state.offers.length || !id) {
    const target = state.phase === 'results' ? '/demo/results' : ['idle', 'complete'].includes(state.phase) ? '/' : `/demo/${state.phase}`;
    return <Redirect href={target} />;
  }
  return <SafeAreaView testID="confirmation-screen" style={styles.screen}>
    <View testID="success-cue" style={styles.content}>
      <Animated.View testID="completion-mark" style={[styles.mark, success && styles.confirmed, { transform: [{ scale }] }]}>
        <Ionicons name={success ? 'checkmark-outline' : 'scan-outline'} size={68} color={success ? theme.colors.primary : theme.colors.accent} />
      </Animated.View>
      {success ? <Text accessibilityRole="header" accessibilityLiveRegion="polite" style={styles.title}>Encontrou!</Text> : <View style={styles.textSpace} />}
    </View>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.primary },
  content: { flex: 1, width: '100%', maxWidth: 640, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 32 },
  mark: { padding: 28, borderRadius: 90 },
  confirmed: { backgroundColor: theme.colors.accent },
  title: { color: theme.colors.accent, fontSize: 38, lineHeight: 48, fontWeight: '700', textAlign: 'center' },
  textSpace: { height: 48 },
});
