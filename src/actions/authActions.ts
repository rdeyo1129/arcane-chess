import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import { RootState, AppDispatch } from 'src/index';

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING,
  LOAD_CAMPAIGN,
  AuthActionTypes,
} from './types';

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
        console.log('res', res);
        // Redirect user to the root or any other page you prefer after successful registration
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
  (userData: { guest: boolean }, navigate: any) => (dispatch: AppDispatch) => {
    axios
      .post('/api/users/login', userData)
      .then((res) => {
        // Save to localStorage
        const { token } = res.data;
        localStorage.setItem('jwtToken', token);
        setAuthToken(token);
        const decoded: object = jwt_decode(token);
        dispatch(setCurrentUser(decoded));
        navigate('/dashboard');
      })
      .catch((err) =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        })
      );
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
