import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { BrandHeader } from '../../components/BrandHeader';
import { theme } from '../../theme';
import { DemoEntry } from '../search/DemoEntry';

export function HomeScreen() {
  return <Screen topContent={<BrandHeader />} safeAreaBackground={theme.colors.primary}>
      <View accessible={false} style={styles.illustration}>
        <View style={styles.productFrame}>
          <Ionicons name="bag-handle-outline" size={46} color={theme.colors.primary} />
          <View style={styles.camera}><Ionicons name="camera-outline" size={18} color={theme.colors.primary} /></View>
        </View>
      </View>
    <DemoEntry />
    <View style={styles.actions}>
      <Text accessibilityRole="header" style={styles.sectionTitle}>Gostou? Comece com uma foto.</Text>
      <Text style={styles.supporting}>Captura de imagens em breve.</Text>
      <Pressable disabled accessibilityRole="button" accessibilityLabel="Fotografar produto, em breve" accessibilityState={{ disabled: true }} style={[styles.futureAction, styles.primaryAction]}>
        <Ionicons name="camera-outline" size={22} color={theme.colors.primary} />
        <Text style={styles.actionText}>Fotografar produto</Text>
        <Ionicons name="lock-closed-outline" size={16} color={theme.colors.primary} />
      </Pressable>
      <Pressable disabled accessibilityRole="button" accessibilityLabel="Escolher da galeria, em breve" accessibilityState={{ disabled: true }} style={styles.futureAction}>
        <Ionicons name="images-outline" size={22} color={theme.colors.primary} />
        <Text style={styles.actionText}>Escolher da galeria</Text>
        <Ionicons name="lock-closed-outline" size={16} color={theme.colors.muted} />
      </Pressable>
    </View>
    <View style={styles.privacy}><Ionicons name="shield-checkmark-outline" size={18} color={theme.colors.muted} /><Text style={styles.privacyText}>Protótipo visual. Nenhuma imagem é enviada.</Text></View>
  </Screen>;
}
const styles = StyleSheet.create({
  illustration: { alignItems: 'center', paddingTop: 4, paddingBottom: 4 },
  productFrame: { width: 80, height: 76, backgroundColor: theme.colors.accentSoft, borderRadius: 20, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-6deg' }] },
  camera: { position: 'absolute', bottom: -4, right: -8, padding: 7, borderRadius: 12, backgroundColor: theme.colors.accent, borderWidth: 3, borderColor: theme.colors.background },
  actions: { gap: 12 },
  sectionTitle: { textAlign: 'center', color: theme.colors.text, fontSize: 19, lineHeight: 26, fontWeight: '600', letterSpacing: -0.3 },
  supporting: { textAlign: 'center', color: theme.colors.muted, fontSize: 13, lineHeight: 20 },
  futureAction: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: theme.colors.surface, borderRadius: 16, borderWidth: 1, borderColor: theme.colors.border },
  primaryAction: { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent },
  actionText: { flex: 1, color: theme.colors.primary, fontSize: 15, lineHeight: 22, fontWeight: '600' },
  privacy: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  privacyText: { flex: 1, color: theme.colors.muted, fontSize: 12, lineHeight: 18 },
});
