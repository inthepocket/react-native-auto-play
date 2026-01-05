import {
  AutoPlayModules,
  HybridAutoPlay,
} from '@iternio/react-native-auto-play';
import { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MusicPlayerScreen } from './screens/MusicPlayerScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const remove = HybridAutoPlay.addListenerRenderState(AutoPlayModules.App, (state) => {
      console.log('*** AppState', state);
    });

    return () => remove();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <MusicPlayerScreen />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default App;
