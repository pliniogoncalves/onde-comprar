import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import { brand } from '../config/brand';
import { theme } from '../theme';
import { AutoFitLine } from './AutoFitLine';

export function BrandHeader() {
  return <View testID="brand-header" style={styles.background}>
    <View style={styles.content}>
      <View accessible={false} style={styles.mark}>
        <Ionicons name="scan-outline" size={36} color={theme.colors.accent} />
        <View style={styles.search}><Ionicons name="search-outline" size={17} color={theme.colors.accent} /></View>
      </View>
      <Text accessibilityRole="header" style={styles.name}>{brand.name}</Text>
      <Text style={styles.slogan}>{brand.slogan}</Text>
      <View style={styles.divider} />
      <AutoFitLine testID="header-description" color={theme.colors.onPrimary}>Descubra onde comprar qualquer produto a partir de uma foto.</AutoFitLine>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  background: { width: '100%', backgroundColor: theme.colors.primary },
  content: { width: '100%', maxWidth: 640, alignSelf: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20, gap: 12 },
  mark: { alignItems: 'center', justifyContent: 'center' },
  search: { position: 'absolute' },
  name: { color: theme.colors.onPrimary, textAlign: 'center', fontSize: 24, lineHeight: 30, fontWeight: '700', letterSpacing: -0.5 },
  slogan: { color: theme.colors.accent, textAlign: 'center', fontSize: 16, lineHeight: 24, fontWeight: '600' },
  divider: { alignSelf: 'stretch', height: StyleSheet.hairlineWidth, backgroundColor: theme.colors.accent, opacity: 0.25, marginVertical: 4 },
});
