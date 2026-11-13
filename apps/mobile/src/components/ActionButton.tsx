import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../theme';

export function ActionButton({ label, onPress, secondary = false, disabled = false }: { label: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, secondary && styles.secondary, (pressed || disabled) && styles.dim]}>
    <Text style={styles.label}>{label}</Text>
  </Pressable>;
}
const styles = StyleSheet.create({
  button: { backgroundColor: theme.colors.accent, borderRadius: 16, padding: 16, minHeight: 52, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.accent },
  secondary: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
  dim: { opacity: 0.6 },
  label: { color: theme.colors.primary, fontWeight: '600', fontSize: 15, lineHeight: 22, textAlign: 'center' },
});
