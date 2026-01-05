import type { AutoImage } from '../types/Image';
import { NitroImageUtil } from './NitroImage';
import type { NitroNowPlayingButton } from '../templates/NowPlayingTemplate';

export type NowPlayingButtonType = 'shuffle' | 'addToLibrary' | 'more' | 'playbackRate' | 'repeat';

export type StandardNowPlayingButton<T> = {
  type: NowPlayingButtonType;
  onPress: (template: T, isSelected: boolean) => void;
  isSelected?: boolean;
};

export type CustomImageButton<T> = {
  type: 'image';
  image: AutoImage;
  onPress: (template: T) => void;
  isSelected?: boolean;
};

export type NowPlayingButton<T> = StandardNowPlayingButton<T> | CustomImageButton<T>;

const convert = <T>(
  template: T,
  buttons?: Array<NowPlayingButton<T>>
): Array<NitroNowPlayingButton> | undefined => {
  if (!buttons) return undefined;

  return buttons.map<NitroNowPlayingButton>((button) => {
    if (button.type === 'image') {
      return {
        type: 'image',
        image: NitroImageUtil.convert(button.image),
        onPress: () => button.onPress(template),
        isSelected: button.isSelected,
      };
    }

    return {
      type: button.type,
      onPress: (isSelected: boolean) => button.onPress(template, isSelected),
      isSelected: button.isSelected,
    };
  });
};

export const NitroNowPlayingButtonUtil = { convert };
