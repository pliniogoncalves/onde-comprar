import type { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

type ScreenProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  topContent?: ReactNode;
  safeAreaBackground?: string;
}>;

export function Screen({ children, title, subtitle, topContent, safeAreaBackground = theme.colors.background }: ScreenProps) {
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: safeAreaBackground }]} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {topContent}
        <View style={styles.content}>
          {title ? <View style={styles.header}>
            <Text accessibilityRole="header" style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View> : null}
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flex: 1, minHeight: 0, backgroundColor: theme.colors.background },
  scrollContent: { flexGrow: 1, alignItems: 'center' },
  content: { width: '100%', maxWidth: 640, padding: 20, paddingBottom: 32, gap: 24 },
  header: { gap: 8, paddingTop: 8 },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.8, color: theme.colors.text },
  subtitle: { fontSize: 15, lineHeight: 22, color: theme.colors.muted },
});
