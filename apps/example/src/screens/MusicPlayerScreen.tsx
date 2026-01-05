import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import TrackPlayer, {
  useActiveTrack,
  usePlaybackState,
  useProgress,
  State,
  Capability,
} from 'react-native-track-player';
import { sampleTracks } from '../data/sampleTracks';
import { createNowPlayingTemplate } from '../carplay/NowPlayingHandler';

export const MusicPlayerScreen: React.FC = () => {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [carPlayConnected, setCarPlayConnected] = useState(false);
  const activeTrack = useActiveTrack();
  const playbackState = usePlaybackState();
  const progress = useProgress();

  useEffect(() => {
    setupPlayer();
  }, []);

  const setupPlayer = async () => {
    try {
      // Check if player is already set up
      const state = await TrackPlayer.getPlaybackState();
      if (state.state !== undefined) {
        // Player already set up
        setIsPlayerReady(true);
        if (Platform.OS === 'ios') {
          setupCarPlayIntegration();
        }
        return;
      }
    } catch (error) {
      // Player not set up yet, continue with setup
    }

    try {
      await TrackPlayer.setupPlayer({
        autoUpdateMetadata: true,
        autoHandleInterruptions: true,
      });

      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
          Capability.Stop,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
      });

      await TrackPlayer.add(sampleTracks);
      setIsPlayerReady(true);

      // Setup CarPlay integration on iOS
      if (Platform.OS === 'ios') {
        setupCarPlayIntegration();
      }
    } catch (error) {
      console.error('Error setting up player:', error);
    }
  };

  const setupCarPlayIntegration = async () => {
    try {
      const nowPlayingTemplate = createNowPlayingTemplate();

      // Auto-push the NowPlaying template when music is playing
      try {
        const state = await TrackPlayer.getPlaybackState();
        if (state.state === State.Playing || state.state === State.Paused) {
          await nowPlayingTemplate.push();
          console.log('NowPlaying template pushed to CarPlay');
        }
      } catch (error) {
        console.log('Could not auto-push NowPlaying template:', error);
      }

      setCarPlayConnected(true);
      console.log('CarPlay NowPlaying template created and ready');
    } catch (error) {
      console.error('Error setting up CarPlay:', error);
    }
  };

  const togglePlayback = async () => {
    const state = playbackState.state;
    if (state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const skipToNext = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.log('Already at last track');
    }
  };

  const skipToPrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (error) {
      console.log('Already at first track');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isPlayerReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Music Player...</Text>
      </View>
    );
  }

  const isPlaying = playbackState.state === State.Playing;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Music Player</Text>
        {Platform.OS === 'ios' && carPlayConnected && (
          <View style={styles.carPlayBadge}>
            <Text style={styles.carPlayText}>🚗 CarPlay Ready</Text>
          </View>
        )}
      </View>

      {activeTrack && (
        <>
          <View style={styles.artworkContainer}>
            <Image
              source={{ uri: activeTrack.artwork as string }}
              style={styles.artwork}
            />
          </View>

          <View style={styles.trackInfo}>
            <Text style={styles.title}>{activeTrack.title}</Text>
            <Text style={styles.artist}>{activeTrack.artist}</Text>
            <Text style={styles.album}>{activeTrack.album}</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(progress.position / progress.duration) * 100 || 0}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(progress.position)}</Text>
              <Text style={styles.timeText}>{formatTime(progress.duration)}</Text>
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity onPress={skipToPrevious} style={styles.controlButton}>
              <Text style={styles.controlIcon}>⏮</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
              <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶️'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={skipToNext} style={styles.controlButton}>
              <Text style={styles.controlIcon}>⏭</Text>
            </TouchableOpacity>
          </View>

          {Platform.OS === 'ios' && (
            <View style={styles.carPlayInfo}>
              <Text style={styles.carPlayInfoText}>
                📱 Connect to CarPlay to access Now Playing controls with additional features:
              </Text>
              <Text style={styles.featureText}>• Shuffle & Repeat buttons</Text>
              <Text style={styles.featureText}>• Playback rate control</Text>
              <Text style={styles.featureText}>• Up Next queue view</Text>
              <Text style={styles.featureText}>• Album/Artist info</Text>
            </View>
          )}

          <View style={{ height: 80 }} />
        </>
      )}

      {!activeTrack && (
        <View style={styles.noTrackContainer}>
          <Text style={styles.noTrackText}>No track playing</Text>
          <TouchableOpacity
            onPress={() => TrackPlayer.play()}
            style={styles.startButton}
          >
            <Text style={styles.startButtonText}>Start Playing</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  carPlayBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  carPlayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  artworkContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  artwork: {
    width: 280,
    height: 280,
    borderRadius: 12,
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  artist: {
    fontSize: 18,
    color: '#999',
    marginBottom: 4,
  },
  album: {
    fontSize: 16,
    color: '#666',
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    color: '#999',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    marginBottom: 30,
  },
  controlButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    fontSize: 36,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 40,
  },
  carPlayInfo: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
  },
  carPlayInfoText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
  },
  featureText: {
    color: '#999',
    fontSize: 13,
    marginLeft: 8,
    marginBottom: 4,
  },
  noTrackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTrackText: {
    color: '#999',
    fontSize: 18,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
