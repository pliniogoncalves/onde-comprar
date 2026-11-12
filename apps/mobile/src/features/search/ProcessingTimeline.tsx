import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';
import type { DemoState } from './demoSession';
import { processingSteps, type OperationStatus } from './processingSteps';
import { useReducedMotion } from './completion/useReducedMotion';

const labels: Record<OperationStatus, string> = { pending: 'Pendente', running: 'Em andamento', done: 'Concluída', error: 'Erro' };
export function ProcessingTimeline({ state }: { state: DemoState }) {
  const reducedMotion = useReducedMotion();
  const running = state.phase === 'recognizing' || state.phase === 'searching';
  return <View style={styles.card}>
    <View style={styles.header}>
      {running && reducedMotion === false ? <ActivityIndicator accessibilityLabel="Processamento demonstrativo em andamento" size="large" color={theme.colors.accent} /> : <Ionicons name={state.phase === 'error' ? 'alert-circle-outline' : 'scan-outline'} size={32} color={theme.colors.accent} />}
      <Text accessibilityRole="header" style={styles.heading}>{state.phase === 'error' ? 'A simulação encontrou um erro' : running ? 'Preparando sua descoberta' : 'Etapas da demonstração'}</Text>
      <Text style={styles.description}>Somente operações locais e simuladas. Nenhuma consulta a lojas.</Text>
    </View>
    {processingSteps(state).map(step => <View key={step.id} style={styles.step} accessibilityLabel={`${step.label}: ${labels[step.status]}`}>
      {step.status === 'running' && reducedMotion === false ? <ActivityIndicator accessible={false} size="small" color={theme.colors.accent} /> : <Ionicons accessible={false} name={step.status === 'done' ? 'checkmark-circle-outline' : step.status === 'error' ? 'close-circle-outline' : step.status === 'running' ? 'hourglass-outline' : 'ellipse-outline'} size={22} color={step.status === 'pending' ? '#A7BDB2' : theme.colors.accent} />}
      <View style={styles.copy}><Text style={[styles.label, step.status === 'pending' && styles.muted]}>{step.label}</Text><Text accessibilityLiveRegion="polite" style={styles.status}>{labels[step.status]}</Text></View>
    </View>)}
  </View>;
}
const styles = StyleSheet.create({
  card: { padding: 24, gap: 22, borderRadius: 24, backgroundColor: theme.colors.primary },
  header: { alignItems: 'center', gap: 12 },
  heading: { color: theme.colors.onPrimary, fontSize: 20, lineHeight: 28, fontWeight: '600', textAlign: 'center' },
  description: { color: '#D2E2D9', fontSize: 13, lineHeight: 21, textAlign: 'center' },
  step: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  copy: { flex: 1, gap: 3 },
  label: { color: theme.colors.onPrimary, fontSize: 14, lineHeight: 21, fontWeight: '600' },
  muted: { color: '#A7BDB2' },
  status: { color: '#D2E2D9', fontSize: 12, lineHeight: 18 },
});
