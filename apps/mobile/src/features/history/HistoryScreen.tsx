import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { theme } from '../../theme';

export function HistoryScreen() {
  return <Screen title="Histórico" subtitle="Um lugar para reencontrar suas descobertas.">
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.sectionTitle}>Suas pesquisas</Text>
      <View style={styles.count}><Text style={styles.countText}>0</Text></View>
    </View>
    <View style={styles.empty}>
      <View accessible={false} style={styles.halo}><Ionicons name="time-outline" size={42} color={theme.colors.primary} /></View>
      <Text accessibilityRole="header" style={styles.title}>Toda descoberta tem um começo</Text>
      <Text style={styles.description}>Suas pesquisas aparecerão aqui para você consultar quando quiser.</Text>
      <View style={styles.divider} />
      <View style={styles.hint}><Ionicons name="camera-outline" size={20} color={theme.colors.muted} /><Text style={styles.hintText}>Em breve, sua primeira foto pode virar uma descoberta.</Text></View>
    </View>
    <Text style={styles.footnote}>Quando disponível, pesquisar novamente fará uma nova consulta às ofertas.</Text>
  </Screen>;
}
const styles = StyleSheet.create({
  section: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionTitle: { color: theme.colors.text, fontSize: 16, fontWeight: '600' },
  count: { backgroundColor: '#E8EDE9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  countText: { color: theme.colors.muted, fontSize: 12, fontWeight: '600' },
  empty: { alignItems: 'center', gap: 18, paddingHorizontal: 24, paddingVertical: 36, borderRadius: 24, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
  halo: { padding: 24, borderRadius: 48, backgroundColor: theme.colors.accentSoft },
  title: { textAlign: 'center', color: theme.colors.text, fontSize: 22, lineHeight: 29, fontWeight: '600', letterSpacing: -0.5 },
  description: { textAlign: 'center', color: theme.colors.muted, fontSize: 15, lineHeight: 23 },
  divider: { height: 1, alignSelf: 'stretch', backgroundColor: theme.colors.border, marginVertical: 4 },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hintText: { flex: 1, fontSize: 13, lineHeight: 20, color: theme.colors.muted },
  footnote: { textAlign: 'center', color: theme.colors.muted, fontSize: 12, lineHeight: 19 },
});
