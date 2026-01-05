import { Platform } from 'react-native';
import { NitroModules } from 'react-native-nitro-modules';
import uuid from 'react-native-uuid';
import { HybridAutoPlay } from '..';
import type { NowPlayingTemplate as NitroNowPlayingTemplateSpec } from '../specs/NowPlayingTemplate.nitro';
import type { NitroTemplateConfig, TemplateConfig } from './Template';
import { type NowPlayingButton, NitroNowPlayingButtonUtil } from '../utils/NitroNowPlayingButton';
import type { NitroImage } from '../utils/NitroImage';

const HybridNowPlayingTemplate =
  Platform.OS !== 'web'
    ? NitroModules.createHybridObject<NitroNowPlayingTemplateSpec>('NowPlayingTemplate')
    : null;

export type NitroNowPlayingButtonType =
  | 'shuffle'
  | 'addToLibrary'
  | 'more'
  | 'playbackRate'
  | 'repeat'
  | 'image';

/**
 * Used to convert the very specific typescript typing to an easier to handle type for native code
 */
export type NitroNowPlayingButton = {
  type: NitroNowPlayingButtonType;
  image?: NitroImage;
  onPress: (isSelected: boolean) => void;
  isSelected?: boolean;
};

export interface NitroNowPlayingTemplateConfig extends TemplateConfig {
  buttons?: Array<NitroNowPlayingButton>;
  albumArtistButtonEnabled?: boolean;
  upNextButtonEnabled?: boolean;
  upNextButtonTitle?: string;
  onUpNextButtonPressed?: () => void;
  onAlbumArtistButtonPressed?: () => void;
}

export type NowPlayingTemplateConfig = Omit<NitroNowPlayingTemplateConfig, 'buttons'> & {
  buttons?: Array<NowPlayingButton<NowPlayingTemplate>>;
};

export class NowPlayingTemplate {
  private template = this;
  public id: string;

  constructor(config: NowPlayingTemplateConfig) {
    this.id = uuid.v4();

    if (Platform.OS === 'web') {
      console.warn('NowPlayingTemplate is not supported on web');
      return;
    }

    const { buttons, ...rest } = config;
    const nitroConfig: NitroNowPlayingTemplateConfig & NitroTemplateConfig = {
      ...rest,
      id: this.id,
      buttons: NitroNowPlayingButtonUtil.convert(this.template, buttons),
    };

    HybridNowPlayingTemplate?.configureNowPlayingTemplate(nitroConfig);
  }

  public push(): Promise<void> {
    if (Platform.OS === 'web' || !HybridNowPlayingTemplate) {
      return Promise.reject(new Error('NowPlayingTemplate is not supported on this platform'));
    }
    return HybridAutoPlay.pushTemplate(this.id);
  }

  public updateButtons(buttons: Array<NowPlayingButton<NowPlayingTemplate>>): Promise<void> {
    if (!HybridNowPlayingTemplate) {
      return Promise.reject(new Error('NowPlayingTemplate is not supported on this platform'));
    }
    return HybridNowPlayingTemplate.updateNowPlayingButtons(
      this.id,
      NitroNowPlayingButtonUtil.convert(this.template, buttons) ?? []
    );
  }

  public setAlbumArtistButtonEnabled(enabled: boolean): Promise<void> {
    if (!HybridNowPlayingTemplate) {
      return Promise.reject(new Error('NowPlayingTemplate is not supported on this platform'));
    }
    return HybridNowPlayingTemplate.setAlbumArtistButtonEnabled(this.id, enabled);
  }

  public setUpNextButtonEnabled(enabled: boolean, title?: string): Promise<void> {
    if (!HybridNowPlayingTemplate) {
      return Promise.reject(new Error('NowPlayingTemplate is not supported on this platform'));
    }
    return HybridNowPlayingTemplate.setUpNextButtonEnabled(this.id, enabled, title);
  }
}
