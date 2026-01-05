import type { HybridObject } from 'react-native-nitro-modules';
import type { NitroNowPlayingButton, NitroNowPlayingTemplateConfig } from '../templates/NowPlayingTemplate';
import type { NitroTemplateConfig } from './AutoPlay.nitro';

interface NowPlayingTemplateConfig extends NitroTemplateConfig, NitroNowPlayingTemplateConfig {}

export interface NowPlayingTemplate extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  configureNowPlayingTemplate(config: NowPlayingTemplateConfig): void;
  updateNowPlayingButtons(templateId: string, buttons: Array<NitroNowPlayingButton>): Promise<void>;
  setAlbumArtistButtonEnabled(templateId: string, enabled: boolean): Promise<void>;
  setUpNextButtonEnabled(templateId: string, enabled: boolean, title: string | undefined): Promise<void>;
}
