import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';

import { Provider } from 'react-redux';
import { store, persistor } from 'src/store/configureStore';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { PersistGate } from 'redux-persist/integration/react';

import { PrivateRoute } from 'src/components/PrivateRoute/PrivateRoute';

import { setCurrentUser, logoutUser } from './actions/authActions';

import '@fontsource/exo';
import '@fontsource/exo/400-italic.css';
import '@fontsource/exo/700-italic.css';

import { FrontPage } from '././pages/frontPage/FrontPage';
import { InGameMenu } from '././pages/inGameMenu/InGameMenu';
import { Campaign } from '././pages/campaign/Campaign';
import { SinglePlayer } from '././pages/singlePlayer/SinglePlayer';
import { Dashboard } from '././pages/dashboard/Dashboard';
import { Book } from '././pages/book/Book';
import { Login } from '././pages/loginRegister/Login';
import { Register } from '././pages/loginRegister/Register';
import { LessonView } from '././pages/lessonView/LessonView';
import { TempleView } from '././pages/templeView/TempleView';
import { MissionView } from '././pages/missionView/MissionView';

import ReactDOM from 'react-dom/client';
// import App from './App';

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);

  // Decode token and get user info and exp
  const decoded: { exp: number } = jwt_decode(token);

  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds

  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = './';
  }
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<FrontPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/create"
        element={
          <PrivateRoute>
            <InGameMenu />
          </PrivateRoute>
        }
      />
      <Route
        path="/campaign"
        element={
          <PrivateRoute>
            <Campaign />
          </PrivateRoute>
        }
      />
      <Route
        path="/chapter"
        element={
          <PrivateRoute>
            <Book />
          </PrivateRoute>
        }
      />
      <Route
        path="/lesson"
        element={
          <PrivateRoute>
            <LessonView />
          </PrivateRoute>
        }
      />
      <Route
        path="/temple"
        element={
          <PrivateRoute>
            <TempleView />
          </PrivateRoute>
        }
      />
      <Route
        path="/mission"
        element={
          <PrivateRoute>
            <MissionView />
          </PrivateRoute>
        }
      />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <App />
      {/* </PersistGate> */}
    </Provider>
  </React.StrictMode>
);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
