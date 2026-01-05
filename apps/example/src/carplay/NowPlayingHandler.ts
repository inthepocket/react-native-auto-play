import { NowPlayingTemplate, ListTemplate } from '@iternio/react-native-auto-play';
import TrackPlayer, { RepeatMode } from 'react-native-track-player';

export function createNowPlayingTemplate() {
  const nowPlaying = new NowPlayingTemplate({
    buttons: [
      {
        type: 'shuffle',
        onPress: async (_, isSelected) => {
          // Toggle shuffle mode
          console.log('Shuffle toggled:', isSelected);
          // Note: react-native-track-player doesn't have built-in shuffle,
          // you'd implement custom shuffle logic here
        },
        isSelected: false,
      },
      {
        type: 'repeat',
        onPress: async (_, isSelected) => {
          // Cycle through repeat modes: off -> track -> queue -> off
          const currentMode = await TrackPlayer.getRepeatMode();
          let nextMode: RepeatMode;

          if (currentMode === RepeatMode.Off) {
            nextMode = RepeatMode.Track;
          } else if (currentMode === RepeatMode.Track) {
            nextMode = RepeatMode.Queue;
          } else {
            nextMode = RepeatMode.Off;
          }

          await TrackPlayer.setRepeatMode(nextMode);
          console.log('Repeat mode changed to:', nextMode);
        },
        isSelected: false,
      },
      {
        type: 'playbackRate',
        onPress: async () => {
          // Cycle through playback rates: 1.0 -> 1.5 -> 2.0 -> 0.5 -> 1.0
          const currentRate = await TrackPlayer.getRate();
          const rates = [0.5, 1.0, 1.5, 2.0];
          const currentIndex = rates.findIndex((r) => Math.abs(r - currentRate) < 0.01);
          const nextIndex = (currentIndex + 1) % rates.length;
          const nextRate = rates[nextIndex];

          await TrackPlayer.setRate(nextRate);
          console.log('Playback rate changed to:', nextRate);
        },
      },
    ],
    upNextButtonEnabled: true,
    onUpNextButtonPressed: () => {
      console.log('Up Next button pressed - showing queue');
      showQueueTemplate();
    },
    albumArtistButtonEnabled: true,
    onAlbumArtistButtonPressed: () => {
      console.log('Album/Artist button pressed');
      // You could push a ListTemplate showing album details or artist info
    },
    onWillAppear: () => {
      console.log('NowPlaying template will appear');
    },
    onDidAppear: () => {
      console.log('NowPlaying template did appear');
    },
  });

  return nowPlaying;
}

async function showQueueTemplate() {
  try {
    const queue = await TrackPlayer.getQueue();
    const currentIndex = await TrackPlayer.getActiveTrackIndex();

    const queueItems = queue.map((track, index) => ({
      type: 'default' as const,
      title: track.title || 'Unknown Track',
      detailedText: track.artist || 'Unknown Artist',
      image: track.artwork ? { uri: track.artwork as string } : undefined,
      browsable: false,
      enabled: true,
      onPress: async () => {
        await TrackPlayer.skip(index);
        await TrackPlayer.play();
      },
    }));

    const queueTemplate = new ListTemplate({
      title: 'Up Next',
      sections: {
        type: 'default',
        items: queueItems,
      },
    });

    await queueTemplate.push();
  } catch (error) {
    console.error('Error showing queue template:', error);
  }
}
