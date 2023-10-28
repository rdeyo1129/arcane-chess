import axios from 'axios';
import { SAVE_CAMPAIGN } from './types';
import { store } from '../store/configureStore';

import { RootState, AppDispatch } from 'src/index';

type SaveCampaignParams = {
  key1: string;
  key2: string;
  value: string | number;
};

export const saveCampaign =
  ({ key1, key2, value }: SaveCampaignParams) =>
  async (dispatch: AppDispatch) => {
    try {
      // Retrieve the whole state
      const state = store.getState();

      // Check if auth state and user exist
      // if (!state.auth || !state.auth.user) {
      //   console.error('Authentication state or user does not exist.');
      //   return;
      // }

      // Now it's safe to access the user's ID
      // const userId = state.auth.user.id;

      const response = await axios.post('/api/campaign', {
        userId: 'hello#%^#%^',
        key1,
        key2,
        value,
      });

      dispatch({
        type: SAVE_CAMPAIGN,
        payload: response.data,
      });
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  };
