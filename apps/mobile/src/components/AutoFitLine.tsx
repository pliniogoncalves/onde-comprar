import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Mede o texto na fonte original para ajustar uma única linha sem truncamento.
// Usa layout do React Native também na web, sem depender de APIs do navegador.
export function AutoFitLine({ children, color, testID }: { children: string; color: string; testID?: string }) {
  const [availableWidth, setAvailableWidth] = useState(0);
  const [naturalWidth, setNaturalWidth] = useState(0);
  const scale = availableWidth && naturalWidth ? Math.min(1, availableWidth / naturalWidth) : 1;

  return <View style={styles.container} onLayout={event => setAvailableWidth(event.nativeEvent.layout.width)}>
    <View aria-hidden accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none" style={styles.probe}>
      <Text numberOfLines={1} style={styles.naturalText} onLayout={event => setNaturalWidth(event.nativeEvent.layout.width)}>{children}</Text>
    </View>
    <Text testID={testID} numberOfLines={1} style={[styles.text, { color, fontSize: 14 * scale }]}>{children}</Text>
  </View>;
}

const styles = StyleSheet.create({
  container: { width: '100%', overflow: 'hidden' },
  probe: { position: 'absolute', flexDirection: 'row', opacity: 0 },
  naturalText: { flexShrink: 0, fontSize: 14 },
  text: { textAlign: 'center', lineHeight: 22 },
});
