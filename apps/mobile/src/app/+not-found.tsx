import { Link } from 'expo-router';
import { Screen } from '../components/Screen';
import { theme } from '../theme';

export default function NotFound() {
  return <Screen title="Página não encontrada" subtitle="Volte ao início para continuar.">
    <Link href="/" style={{ color: theme.colors.primary, fontSize: 18, paddingVertical: 16 }}>Ir para o início</Link>
  </Screen>;
}
