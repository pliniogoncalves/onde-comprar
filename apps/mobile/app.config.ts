import type { ExpoConfig } from 'expo/config';
import brand from './src/config/brand.json';

const config: ExpoConfig = {
  name: brand.name,
  slug: 'onde-comprar',
  scheme: 'onde-comprar',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  plugins: ['expo-router'],
  ios: { supportsTablet: true },
  android: { adaptiveIcon: { backgroundColor: '#102B25' } },
};
export default config;
