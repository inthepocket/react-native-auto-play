import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import TrackPlayer from 'react-native-track-player';
import App from './src/App';
import registerRunnable from './src/AutoPlay';
import { StateWrapper } from './src/state/store';
import { PlaybackService } from './src/services/playbackService';

AppRegistry.setWrapperComponentProvider(() => StateWrapper);
AppRegistry.registerComponent(appName, () => App);

// Register the playback service for react-native-track-player
TrackPlayer.registerPlaybackService(() => PlaybackService);

registerRunnable();
