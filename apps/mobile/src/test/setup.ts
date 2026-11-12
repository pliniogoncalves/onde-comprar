jest.mock('@react-native-async-storage/async-storage', () =>
  // Jest avalia a fábrica do mock antes dos imports do módulo.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Os testes de preferências não exercitam o carregamento nativo de fontes.
jest.mock('expo-font', () => ({
  isLoaded: () => true,
  loadAsync: jest.fn().mockResolvedValue(undefined),
}));
