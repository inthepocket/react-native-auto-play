import {
  AutoPlayCluster,
  CarPlayDashboard,
  HybridAutoPlay,
  ListTemplate,
  NowPlayingTemplate,
} from '@iternio/react-native-auto-play';
import { Platform } from 'react-native';
import { Cluster } from './AutoPlayCluster';
import { AutoPlayDashboard } from './AutoPlayDashboard';

const registerRunnable = () => {
  const onConnect = () => {
    console.log('===== CARPLAY ONCONNECT CALLED =====');
    try {
      // Create NowPlayingTemplate
      const nowPlayingTemplate = new NowPlayingTemplate({
        albumArtistButtonEnabled: true,
        upNextButtonEnabled: true,
        upNextButtonTitle: 'Up Next',
        onWillAppear: () => console.log('NowPlaying template will appear'),
        onDidAppear: () => console.log('NowPlaying template did appear'),
      });
      console.log('===== NowPlayingTemplate created =====');

      // Create a simple ListTemplate as the root template
      const rootTemplate = new ListTemplate({
        title: { text: 'Music' },
        sections: {
          type: 'default',
          items: [
            {
              type: 'default',
              title: { text: 'Now Playing' },
              detailedText: { text: 'View current track' },
              image: { name: 'music_note', type: 'glyph' },
              onPress: () => {
                console.log('Now Playing tapped - pushing NowPlayingTemplate');
                nowPlayingTemplate.push();
              },
            },
          ],
        },
        onWillAppear: () => console.log('Root template will appear'),
        onDidAppear: () => console.log('Root template did appear'),
      });
      console.log('===== ListTemplate created =====');

      rootTemplate.setRootTemplate();
      console.log('===== setRootTemplate called =====');
    } catch (error) {
      console.error('===== ERROR in onConnect =====', error);
    }
  };

  const onDisconnect = () => {
    console.log('===== CARPLAY ONDISCONNECT CALLED =====');
  };

  console.log('===== registerRunnable called =====');

  if (Platform.OS === 'ios') {
    CarPlayDashboard.setComponent(AutoPlayDashboard);
    AutoPlayCluster.setAttributedInactiveDescriptionVariants([
      { text: 'Example', images: [{ image: { name: 'bolt', type: 'glyph' }, position: 0 }] },
    ]);
  }
  AutoPlayCluster.setComponent(Cluster);

  console.log('===== Adding didConnect listener =====');
  HybridAutoPlay.addListener('didConnect', onConnect);
  HybridAutoPlay.addListener('didDisconnect', onDisconnect);
  console.log('===== Listeners added =====');
};

export default registerRunnable;
