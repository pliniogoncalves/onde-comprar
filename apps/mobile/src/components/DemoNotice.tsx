import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export function DemoNotice() {
  return <View style={styles.banner}><Text style={styles.text}>Demonstração • Produto, lojas e preços fictícios.</Text></View>;
}
const styles = StyleSheet.create({
  banner: { paddingHorizontal: 12, paddingVertical: 9, backgroundColor: theme.colors.accentSoft, borderRadius: 14 },
  text: { color: theme.colors.primary, fontSize: 12, lineHeight: 19, fontWeight: '500' },
});
