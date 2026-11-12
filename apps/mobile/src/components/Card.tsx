import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export function Card({ title, children }: PropsWithChildren<{ title: string }>) {
  return <View style={styles.card}>
    <Text accessibilityRole="header" style={styles.title}>{title}</Text>
    <Text style={styles.body}>{children}</Text>
  </View>;
}
const styles = StyleSheet.create({
  card: { backgroundColor: theme.colors.surface, padding: 20, gap: 8, borderRadius: theme.radius.card, borderWidth: 1, borderColor: theme.colors.border },
  title: { color: theme.colors.text, fontSize: 17, lineHeight: 24, fontWeight: '600' },
  body: { color: theme.colors.muted, fontSize: 14, lineHeight: 22 },
});
