import {
  SET_CURRENT_USER,
  USER_LOADING,
  LOAD_CAMPAIGN,
  SAVE_CAMPAIGN,
  SET_NODE,
} from '../actions/types';

// const isEmpty = require("is-empty");

import isEmpty from 'is-empty';

interface InitialStateTypes {
  isAuthenticated: boolean;
  user: object;
  campaign: object;
  loading: false;
}

const initialState: InitialStateTypes = {
  isAuthenticated: false,
  user: { id: '' },
  campaign: {},
  loading: false,
};

export default function (
  state = initialState,
  action: {
    type: string;
    payload: { [key: string]: object | string | number | null };
  }
) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true,
      };
    case LOAD_CAMPAIGN:
      return {
        ...state,
        campaign: action.payload,
      };
    case SAVE_CAMPAIGN:
      return {
        ...state,
        campaign: action.payload,
      };
    case SET_NODE:
      return {
        ...state,
        campaign: {
          ...state.campaign,
          currentNode: {
            ...action.payload,
          },
        },
      };
    default:
      return state;
  }
}
