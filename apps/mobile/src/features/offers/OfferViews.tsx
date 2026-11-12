import { StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '../../components/ActionButton';
import type { Offer } from '../../domain/contracts';
import { theme } from '../../theme';

export function formatPrice(offer: Offer) {
  return offer.price ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: offer.price.currency }).format(offer.price.amountMinor / 100) : 'Preço não informado';
}
export function OfferList({ offers, onSelect }: { offers: Offer[]; onSelect: (offer: Offer) => void }) {
  return <View style={styles.list}>
    {(['exact', 'similar'] as const).map(type => <View key={type} style={styles.list}>
      <Text accessibilityRole="header" style={styles.heading}>{type === 'exact' ? 'Correspondências exatas' : 'Produtos semelhantes'}</Text>
      {offers.filter(offer => offer.matchType === type).length === 0 ? <Text style={styles.body}>Nenhuma oferta neste grupo.</Text> : null}
      {offers.filter(offer => offer.matchType === type).sort((a, b) => (a.price?.amountMinor ?? Infinity) - (b.price?.amountMinor ?? Infinity)).map(offer => <View style={styles.card} key={offer.id}>
        <Text style={styles.merchant}>{offer.merchant} • fictícia</Text>
        <Text style={styles.title}>{offer.product.name} {offer.product.brand} {offer.product.model}</Text>
        <Text style={styles.price}>{formatPrice(offer)} <Text style={styles.body}>• preço fictício</Text></Text>
        <Text style={styles.body}>{offer.matchReason}</Text>
        <ActionButton secondary label={`Detalhes de ${offer.merchant}`} onPress={() => onSelect(offer)} />
      </View>)}
    </View>)}
  </View>;
}
export function OfferDetail({ offer }: { offer: Offer }) {
  return <View style={styles.card}>
    <Text style={styles.merchant}>{offer.merchant} • loja fictícia</Text>
    <Text accessibilityRole="header" style={styles.heading}>{offer.product.name} {offer.product.brand} {offer.product.model}</Text>
    <Text style={styles.price}>{formatPrice(offer)}</Text>
    <Text style={styles.body}>Preço fictício, sem validade comercial.</Text>
    <Text style={styles.body}>{offer.matchType === 'exact' ? 'Correspondência exata' : 'Produto semelhante'}: {offer.matchReason}</Text>
    <Text style={styles.body}>Fonte: adaptador mock local.</Text>
    <Text style={styles.body}>Data da simulação: {new Date(offer.capturedAt).toLocaleString('pt-BR')}</Text>
    <Text style={styles.body}>Estoque, frete e disponibilidade não são consultados. Não há compra ou redirecionamento comercial nesta demonstração.</Text>
  </View>;
}
const styles = StyleSheet.create({
  list: { gap: 18 },
  card: { padding: 20, gap: 12, borderRadius: 20, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
  merchant: { color: theme.colors.muted, fontSize: 12, lineHeight: 19 },
  heading: { color: theme.colors.text, fontSize: 20, lineHeight: 28, fontWeight: '600' },
  title: { color: theme.colors.text, fontSize: 16, lineHeight: 23, fontWeight: '600' },
  price: { color: theme.colors.primary, fontSize: 24, lineHeight: 32, fontWeight: '700' },
  body: { color: theme.colors.muted, fontSize: 14, lineHeight: 22 },
});
