import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '../../../components/ActionButton';
import { theme } from '../../../theme';
import { usePreferences } from '../../preferences/PreferencesProvider';
import { useDemo } from '../DemoProvider';
import { completionExperience } from './completion';
import { useReducedMotion } from './useReducedMotion';

export function CompletionView() {
  const { state, session, sound } = useDemo();
  const { preferences, ready } = usePreferences();
  const reducedMotion = useReducedMotion();
  const [soundUnavailable, setSoundUnavailable] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  useFocusEffect(useCallback(() => {
    if (!ready || reducedMotion === null || !state.completionId) return;
    const plan = session.completion.claim(state.completionId, 'success', preferences, state.offers.length);
    if (!plan) return;
    let active = true;
    if (!reducedMotion) {
      scale.setValue(0.9);
      Animated.timing(scale, { toValue: 1, duration: completionExperience.animationDurationMs, useNativeDriver: true }).start();
    }
    // Animação e tentativa de som iniciadas pelo mesmo evento de conclusão.
    if (plan.playSound) void sound.play().then(played => { if (active && !played) setSoundUnavailable(true); });
    return () => { active = false; scale.stopAnimation(); scale.setValue(1); sound.stop(); };
  }, [ready, reducedMotion, state.completionId, state.offers.length, session, preferences, sound, scale]));
  return <View style={styles.content}>
    <Animated.View testID="completion-mark" style={[styles.mark, { transform: [{ scale }] }]}><Ionicons name="checkmark-outline" size={56} color={theme.colors.primary} /></Animated.View>
    <Text accessibilityRole="header" accessibilityLiveRegion="polite" style={styles.title}>Encontrou!</Text>
    <Text style={styles.body}>Encontramos ofertas fictícias para você explorar nesta demonstração.</Text>
    {soundUnavailable ? <Text style={styles.body}>O som não pôde ser reproduzido. A demonstração continua normalmente.</Text> : null}
    <ActionButton label="Ver ofertas demonstrativas" onPress={() => session.results()} />
  </View>;
}
const styles = StyleSheet.create({
  content: { gap: 24 },
  mark: { alignSelf: 'center', padding: 24, backgroundColor: theme.colors.accent, borderRadius: 60 },
  title: { color: theme.colors.primary, fontSize: 32, lineHeight: 40, fontWeight: '700', textAlign: 'center' },
  body: { color: theme.colors.muted, fontSize: 15, lineHeight: 23, textAlign: 'center' },
});
