import { StyleSheet, Switch, Text, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { IconBadge } from '../../components/IconBadge';
import { theme } from '../../theme';
import { usePreferences } from './PreferencesProvider';

const options = [
  { key: 'soundEnabled', label: 'Som ao encontrar', description: 'Um som curto na conclusão da busca.', icon: 'volume-medium-outline' },
  { key: 'hapticsEnabled', label: 'Feedback tátil ao encontrar', description: 'Em preparação. Vibração ainda indisponível.', icon: 'phone-portrait-outline' },
] as const;

export function PreferencesScreen() {
  const { preferences, ready, storageError, update } = usePreferences();
  return <Screen title="Preferências" subtitle="Pequenos detalhes. Do seu jeito.">
    <View style={styles.sectionHeader}>
      <Text accessibilityRole="header" style={styles.sectionTitle}>Ao encontrar um produto</Text>
      <Text style={styles.supporting}>Escolha como receber a confirmação.</Text>
    </View>
    <View style={styles.group}>
      {options.map(({ key, label, description, icon }, index) => <View key={key} style={[styles.row, index > 0 && styles.rowBorder]}>
        <IconBadge name={icon} />
        <View style={styles.copy}><Text style={styles.label}>{label}</Text><Text style={styles.description}>{description}</Text></View>
        <Switch accessibilityLabel={label} disabled={!ready} value={preferences[key]} onValueChange={value => update(key, value)} trackColor={{ false: '#D5DED7', true: theme.colors.accent }} thumbColor={theme.colors.primary} />
      </View>)}
    </View>
    <Text style={styles.note}>O som é opcional e toca somente ao concluir uma busca com ofertas. O navegador pode bloquear a reprodução. A vibração ainda não está implementada.</Text>
    {storageError ? <Text accessibilityRole="alert" style={styles.note}>Não foi possível acessar as preferências salvas. As alterações podem não permanecer.</Text> : null}
    <View style={styles.privacy}>
      <IconBadge name="shield-checkmark-outline" />
      <View style={styles.copy}><Text accessibilityRole="header" style={styles.label}>Só neste aparelho</Text><Text style={styles.description}>Apenas suas preferências são salvas. Nenhuma imagem é enviada.</Text></View>
    </View>
  </Screen>;
}
const styles = StyleSheet.create({
  sectionHeader: { gap: 6 },
  sectionTitle: { fontSize: 17, lineHeight: 24, fontWeight: '600', color: theme.colors.text },
  supporting: { fontSize: 14, lineHeight: 21, color: theme.colors.muted },
  group: { backgroundColor: theme.colors.surface, borderRadius: 20, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 20 },
  rowBorder: { borderTopWidth: 1, borderTopColor: theme.colors.border },
  copy: { flex: 1, gap: 6, minWidth: 0 },
  label: { color: theme.colors.text, fontSize: 15, lineHeight: 21, fontWeight: '600' },
  description: { color: theme.colors.muted, fontSize: 13, lineHeight: 20 },
  note: { color: theme.colors.muted, fontSize: 12, lineHeight: 19 },
  privacy: { flexDirection: 'row', gap: 14, padding: 20, borderRadius: 20, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
});
