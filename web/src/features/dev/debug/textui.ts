import { TextUiProps } from '../../../typings';
import { debugData } from '../../../utils/debugData';

let holdInterval: ReturnType<typeof setInterval> | null = null;
let holdProgress = 0;

export const debugTextUI = () => {
  debugData<TextUiProps>([
    {
      action: 'textUi',
      data: {
        text: '[E] - Ouvrir le casier',
        position: 'right-center',
        icon: 'door-open',
      },
    },
  ]);
};

export const debugTextUIHold = () => {
  holdProgress = 0;
  
  if (holdInterval) {
    clearInterval(holdInterval);
  }
  
  holdInterval = setInterval(() => {
    holdProgress += 2;
    
    if (holdProgress > 100) {
      if (holdInterval) {
        clearInterval(holdInterval);
        holdInterval = null;
      }
      debugData([{ action: 'textUiHide', data: {} }]);
      return;
    }
    
    debugData<TextUiProps>([
      {
        action: 'textUi',
        data: {
          text: '[E] - Maintenir pour ouvrir',
          position: 'right-center',
          icon: 'hand-holding',
          holdProgress: holdProgress,
          holdMax: 100,
        },
      },
    ]);
  }, 50);
};
