import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import { AppDispatch } from 'src/index';

import { setLocalStorage, getLocalStorage } from 'src/utils/handleLocalStorage';

import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from './types';

// interface AuthState {
//   isAuthenticated: boolean;
//   // add other properties of auth state
// }
// type MyThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   RootState,
//   unknown,
//   AuthActionTypes
// >;

// Register User
export const registerUser =
  (userData: object, navigate: (path: string) => void) =>
  (dispatch: AppDispatch) => {
    axios
      .post('/api/users/register', userData)
      .then((res) => {
        setLocalStorage({
          auth: {
            user: {
              id: res.data._id,
              username: res.data.username,
              campaign: {
                topScores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as number[],
              },
            },
          },
          chapter: 0,
          config: {},
          nodeScores: {},
          inventory: {},
          nodeId: '',
        });
        navigate('/login');
      })
      .catch((err) => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      });
  };

// Login - get user token
export const loginUser =
  (userData: any, navigate: any) => (dispatch: AppDispatch) => {
    axios
      .post('/api/users/login', userData)
      .then((res) => {
        // Save to localStorage
        const { token } = res.data;
        localStorage.setItem('jwtToken', token);
        setAuthToken(token);
        const decoded: object = jwt_decode(token);
        dispatch(setCurrentUser(decoded));
        if (userData.guest || getLocalStorage(userData.username) === null) {
          setLocalStorage({
            auth: {
              user: {
                id: res.data.id || '0',
                username: userData.username,
                campaign: {
                  topScores: userData.guest
                    ? [...Array(12).fill(0)]
                    : ([...res.data.campaign.topScores] as number[]),
                },
              },
            },
            chapter: 0,
            config: {},
            nodeScores: {},
            lessonsCompleted: [],
            inventory: {},
            nodeId: '',
          });
        }
        navigate('/dashboard');
      })
      .catch((err) => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      });
  };

// Set logged in user
export const setCurrentUser = (decoded: object) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING,
  };
};

// Log user out
export const logoutUser = () => (dispatch: AppDispatch) => {
  localStorage.removeItem('jwtToken');
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};
