import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../theme';

export function IconBadge({ name }: { name: ComponentProps<typeof Ionicons>['name'] }) {
  return <View accessible={false} style={styles.badge}>
    <Ionicons name={name} size={24} color={theme.colors.primary} />
  </View>;
}
const styles = StyleSheet.create({
  badge: { padding: 12, borderRadius: 16, alignSelf: 'flex-start', backgroundColor: theme.colors.accentSoft },
});
