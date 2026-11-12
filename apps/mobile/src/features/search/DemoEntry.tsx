import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '../../components/ActionButton';
import { scenarios, type DemoScenario } from '../../fixtures/demo';
import { theme } from '../../theme';
import { useDemo } from './DemoProvider';

export function DemoEntry() {
  const [scenario, setScenario] = useState<DemoScenario>('success');
  const { session } = useDemo();
  const router = useRouter();
  return <View style={styles.content}>
    <Text accessibilityRole="header" style={styles.title}>Experimente com uma imagem de exemplo</Text>
    <Text style={styles.description}>Cenário da demonstração</Text>
    <View style={styles.choices}>
      {scenarios.map(item => <Pressable key={item.id} accessibilityRole="radio" aria-checked={item.id === scenario} onPress={() => setScenario(item.id)} style={[styles.choice, item.id === scenario && styles.selected]}>
        <Text style={styles.choiceText}>{item.label}</Text>
      </Pressable>)}
    </View>
    <ActionButton label="Experimentar demonstração" onPress={() => { session.start(scenario); router.push('/demo/review'); }} />
    <Text style={styles.description}>Dados fictícios e imagem local. Sem câmera, IA ou consultas a lojas.</Text>
  </View>;
}
const styles = StyleSheet.create({
  content: { gap: 14, padding: 18, borderRadius: 20, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
  title: { color: theme.colors.primary, fontSize: 17, lineHeight: 24, fontWeight: '600' },
  description: { color: theme.colors.muted, fontSize: 12, lineHeight: 19 },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choice: { padding: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, minHeight: 44, justifyContent: 'center' },
  selected: { backgroundColor: theme.colors.accentSoft, borderColor: theme.colors.primary },
  choiceText: { color: theme.colors.primary, fontSize: 12, lineHeight: 18 },
});
