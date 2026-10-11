import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { useMusicStore } from './src/store/musicStore';
import { loadCatalog } from './src/services/catalogService';

export default function App() {
  const { setTracks, setIsLoading, setError, loadState } = useMusicStore();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        console.log('🚀 Iniciando MZ MUSIC...');
        await loadState();
        console.log('✅ Estado local cargado');
        
        const catalog = await loadCatalog();
        console.log(`✅ Catálogo cargado: ${catalog.length} tracks`);
        
        setTracks(catalog);
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Bootstrap failed:', error);
        setError('No se pudo cargar el catálogo. Revisa la conexión e inténtalo más tarde.');
        setIsLoading(false);
      }
    };

    bootstrap();
  }, [setTracks, setIsLoading, setError, loadState]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
