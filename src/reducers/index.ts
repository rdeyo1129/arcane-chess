import { combineReducers } from 'redux';
import auth from './authReducer';
// import tournament from "./tournamentReducer";
// import game from './gameReducer';
// import room from "./saveRoom";
import loginRegisterErrors from './authError';

export default combineReducers({
  auth,
  // tournament,
  // game,
  // room,
  loginRegisterErrors,
});
