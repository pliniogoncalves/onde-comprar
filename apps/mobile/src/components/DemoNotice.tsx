import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export function DemoNotice() {
  return <View style={styles.banner}><Text style={styles.text}>DEMONSTRAÇÃO • Imagem, produto, lojas e preços fictícios. Nenhuma consulta externa.</Text></View>;
}
const styles = StyleSheet.create({
  banner: { padding: 14, backgroundColor: theme.colors.accentSoft, borderRadius: 14, borderWidth: 1, borderColor: theme.colors.border },
  text: { color: theme.colors.primary, fontSize: 12, lineHeight: 19, fontWeight: '500' },
});
