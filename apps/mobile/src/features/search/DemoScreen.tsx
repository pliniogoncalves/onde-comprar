import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { Image, StyleSheet, Text } from 'react-native';
import { ActionButton } from '../../components/ActionButton';
import { DemoNotice } from '../../components/DemoNotice';
import { Screen } from '../../components/Screen';
import { demoImage } from '../../fixtures/demo';
import { theme } from '../../theme';
import { IdentificationForm } from '../recognition/IdentificationForm';
import { OfferDetail, OfferList } from '../offers/OfferViews';
import { useDemo } from './DemoProvider';
import { CompletionView } from './completion/CompletionView';
import type { Phase } from './demoSession';
import { ProcessingTimeline } from './ProcessingTimeline';

function stepFor(phase: Phase) { return phase === 'recognizing' || phase === 'searching' ? 'processing' : phase; }
const titles: Record<string, string> = { review: 'Revise a imagem', processing: 'Demonstração em andamento', identify: 'Este é o produto?', inconclusive: 'Não identificamos o produto', complete: 'Busca demonstrativa concluída', results: 'Ofertas demonstrativas', offer: 'Detalhe da oferta', empty: 'Nenhuma oferta encontrada', error: 'A busca teve um problema', cancelled: 'Demonstração cancelada' };

export function DemoScreen() {
  const { state, session } = useDemo();
  const { step, offerId } = useLocalSearchParams<{ step: string; offerId?: string }>();
  const router = useRouter();
  const expected = stepFor(state.phase);
  if (state.phase === 'idle') return <Screen title="Recomece a demonstração"><DemoNotice /><Text style={styles.body}>A sessão é temporária. Recarregar a página encerra seus dados.</Text><ActionButton label="Ir para o início" onPress={() => router.replace('/')} /></Screen>;
  const isDetail = step === 'offer' && state.phase === 'results';
  if (step !== expected && !isDetail) return <Redirect href={`/demo/${expected}`} />;
  const selected = isDetail ? state.offers.find(offer => offer.id === offerId) : undefined;
  return <Screen title={titles[step] ?? 'Demonstração'}>
    <DemoNotice />
    {state.phase === 'review' ? <>
      <Image accessibilityLabel="Ilustração fictícia do fone Aurora A1" source={demoImage} resizeMode="contain" style={styles.image} />
      <Text style={styles.body}>Imagem de exemplo local. Nenhuma imagem será enviada ou analisada por IA.</Text>
      <ActionButton label="Iniciar identificação simulada" onPress={() => { void session.recognize(); }} />
    </> : null}
    {['recognizing', 'searching'].includes(state.phase) ? <>
      <ProcessingTimeline state={state} />
      <ActionButton secondary label="Cancelar demonstração" onPress={() => session.cancel()} />
    </> : null}
    {['identify', 'inconclusive'].includes(state.phase) ? <>
      {state.phase === 'inconclusive' ? <Text style={styles.body}>Este cenário não identifica a imagem. Você pode informar o produto manualmente ou rever a demonstração.</Text> : null}
      <IdentificationForm product={state.product} onConfirm={product => session.confirm(product)} />
      <ActionButton secondary label="Rever imagem" onPress={() => session.start(state.scenario)} />
    </> : null}
    {state.phase === 'complete' ? <CompletionView /> : null}
    {state.phase === 'results' && !isDetail ? <>
      <Text style={styles.heading}>{state.product?.name} {state.product?.brand} {state.product?.model}</Text>
      <Text style={styles.body}>Menor preço dentro de cada grupo. Todos os valores abaixo são fictícios.</Text>
      <OfferList offers={state.offers} onSelect={offer => router.push({ pathname: '/demo/offer', params: { offerId: offer.id } })} />
      <ActionButton secondary label="Corrigir produto e pesquisar novamente" onPress={() => session.edit()} />
    </> : null}
    {isDetail ? <>
      {selected ? <OfferDetail offer={selected} /> : <Text style={styles.body}>Essa oferta não pertence à sessão atual.</Text>}
      <ActionButton secondary label="Voltar às ofertas" onPress={() => router.replace('/demo/results')} />
    </> : null}
    {['empty', 'error', 'cancelled'].includes(state.phase) ? <>
      {state.phase === 'error' ? <ProcessingTimeline state={state} /> : null}
      <Text style={styles.body}>{state.phase === 'empty' ? 'O catálogo fictício não tem ofertas para esses dados ou para o cenário escolhido. Nenhum estoque real foi consultado.' : state.phase === 'error' ? 'Este é um erro previsto no cenário demonstrativo. Você pode rever a imagem ou escolher outro cenário no início.' : 'As operações pendentes foram interrompidas. Nenhum efeito de conclusão será reproduzido.'}</Text>
      {state.phase === 'empty' ? <ActionButton label="Corrigir identificação" onPress={() => session.edit()} /> : null}
      <ActionButton secondary label="Rever demonstração" onPress={() => session.start(state.scenario)} />
    </> : null}
    <ActionButton secondary label="Encerrar e voltar ao início" onPress={() => { session.cancel(); router.replace('/'); }} />
  </Screen>;
}
const styles = StyleSheet.create({
  image: { width: '100%', height: 220, borderRadius: 20, backgroundColor: theme.colors.accentSoft },
  body: { color: theme.colors.muted, fontSize: 14, lineHeight: 22 },
  heading: { color: theme.colors.primary, fontSize: 18, lineHeight: 26, fontWeight: '600' },
});
