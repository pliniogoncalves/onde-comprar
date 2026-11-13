import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { ActionButton } from '../../components/ActionButton';
import type { Product } from '../../domain/contracts';
import { theme } from '../../theme';

export function IdentificationForm({ product, onConfirm }: { product: Product | null; onConfirm: (product: Product) => Promise<void> }) {
  const [draft, setDraft] = useState<Product>(product ?? { name: '', brand: '', model: '' });
  const [error, setError] = useState('');
  return <View style={styles.form}>
    <Text style={styles.description}>Confirme ou corrija os dados. O exemplo disponível é Fone de ouvido / Aurora / A1. Outros produtos podem não ter ofertas neste catálogo fictício.</Text>
    {([{ key: 'name', label: 'Nome do produto (obrigatório)' }, { key: 'brand', label: 'Marca' }, { key: 'model', label: 'Modelo' }] as const).map(({ key, label }) => <View key={key} style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput accessibilityLabel={label} value={draft[key] ?? ''} onChangeText={text => { setDraft(current => ({ ...current, [key]: text })); setError(''); }} style={styles.input} maxLength={120} autoCorrect={false} />
    </View>)}
    {error ? <Text accessibilityRole="alert" style={styles.description}>{error}</Text> : null}
    <ActionButton label="Confirmar e buscar ofertas simuladas" onPress={() => { if (!draft.name.trim()) { setError('Informe o nome do produto.'); return; } void onConfirm(draft).catch(() => setError('Não foi possível confirmar o produto.')); }} />
  </View>;
}
const styles = StyleSheet.create({
  form: { gap: 18 },
  field: { gap: 8 },
  label: { color: theme.colors.text, fontSize: 14, lineHeight: 21, fontWeight: '600' },
  input: { color: theme.colors.text, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 14, fontSize: 16, minHeight: 50 },
  description: { color: theme.colors.muted, fontSize: 14, lineHeight: 22 },
});
