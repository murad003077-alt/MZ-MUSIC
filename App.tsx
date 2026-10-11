import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { useMusicStore } from './src/store/musicStore';
import { loadCatalog } from './src/data/catalog';

export default function App() {
  const { setTracks, setIsLoading, setError, loadState } = useMusicStore();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await loadState();
        const catalog = await loadCatalog();
        setTracks(catalog);
        if (catalog.length > 0) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Bootstrap failed:', error);
        setError('No se pudo cargar el catálogo. Revisa la conexión e inténtalo más tarde.');
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
