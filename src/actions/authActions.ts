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

export const getGuestUserFromLocalStorage = () => {
  const guestKey = Object.keys(localStorage).find((key) =>
    key.startsWith('guest')
  );
  if (guestKey) {
    const guestData = getLocalStorage(guestKey);
    if (guestData) {
      return { key: guestKey, data: guestData };
    }
  }
  return null;
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

        const existingGuestUser = getGuestUserFromLocalStorage();
        console.log('Existing Guest User: ', existingGuestUser); // Log for debugging

        if (userData.guest || getLocalStorage(userData.username) === null) {
          if (
            existingGuestUser &&
            existingGuestUser.data.auth &&
            existingGuestUser.data.auth.user
          ) {
            // Update existing guest data
            const updatedGuestData = {
              ...existingGuestUser.data,
              auth: {
                ...existingGuestUser.data.auth,
                user: {
                  ...existingGuestUser.data.auth.user,
                  id: res.data.id || '0',
                  username: existingGuestUser.data.auth.user.username, // Use existing guest username
                  campaign: {
                    ...existingGuestUser.data.auth.user.campaign,
                    topScores: [...res.data.campaign.topScores] as number[],
                  },
                },
              },
            };
            setLocalStorage(updatedGuestData);
          }
        } else {
          // Set new localStorage data if no existing guest is found
          setLocalStorage({
            ...getLocalStorage(userData.username),
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
          });
        }
        navigate('/dashboard');
      })
      .catch((err) => {
        console.error('Login Error: ', err); // Log the error for debugging
        const errorPayload = err.response
          ? err.response.data
          : { message: 'An error occurred. Please try again.' };
        dispatch({
          type: GET_ERRORS,
          payload: errorPayload,
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
