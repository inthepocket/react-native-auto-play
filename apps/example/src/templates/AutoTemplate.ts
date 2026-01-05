import {
  type BackButton,
  type HeaderActions,
  HybridAutoPlay,
  TextPlaceholders,
} from '@iternio/react-native-auto-play';
import { AutoMessageTemplate } from './AutoMessageTemplate';

const backButton: BackButton = {
  type: 'back',
  onPress: () => HybridAutoPlay.popTemplate(),
};

const headerActions: HeaderActions<unknown> = {
  android: {
    startHeaderAction: backButton,
    endHeaderActions: [
      {
        type: 'textImage',
        image: { name: 'help', type: 'glyph' },
        title: 'help',
        onPress: () => {
          console.log('*** help \\o/');
          AutoMessageTemplate.getTemplate({
            message: {
              text: `help \\o/ ${TextPlaceholders.Duration}`,
              duration: 4711,
            },
          }).push();
        },
      },
      {
        type: 'image',
        image: { name: 'close', type: 'glyph' },
        onPress: () => {
          HybridAutoPlay.popToRootTemplate();
        },
      },
    ],
  },
  ios: {
    backButton,
    trailingNavigationBarButtons: [
      {
        type: 'text',
        title: 'help',
        onPress: () => {
          console.log('*** help \\o/');
          AutoMessageTemplate.getTemplate({
            message: {
              text: `help \\o/ ${TextPlaceholders.Duration}`,
              duration: 4711,
            },
          }).push();
        },
      },
      {
        type: 'image',
        image: { name: 'close', type: 'glyph' },
        onPress: () => {
          HybridAutoPlay.popToRootTemplate();
        },
      },
    ],
  },
};

export const AutoTemplate = { headerActions };
