import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';

import '@fontsource/exo';
import '@fontsource/exo/400-italic.css';
import '@fontsource/exo/700-italic.css';

import { FrontPage } from '././pages/frontPage/FrontPage';
import { InGameMenu } from '././pages/inGameMenu/InGameMenu';
import { SinglePlayer } from '././pages/singlePlayer/SinglePlayer';
import { Dashboard } from '././pages/dashboard/Dashboard';

import ReactDOM from 'react-dom/client';
// import App from './App';

{
  /* <Route exact path="/" component={Dashboard} />
<Route exact path="/create" component={InGameMenu} />
<Route exact path="/" component={SinglePlayer} />
<Route exact path="/" component={FrontPage} />

<Route path="/about" component={About} />
<Route path="/404" component={NotFound} /> */
}
{
  /* <Redirect to="/404" /> */
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Dashboard />} />
      <Route path="/create" element={<InGameMenu />} />
      <Route path="/tactorius" element={<FrontPage />} />
      {/* <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} /> */}
    </Route>
  )
);

function App({ routes }: { routes: (typeof Route)[] }) {
  return <RouterProvider router={router}></RouterProvider>;
}

const myRoutes = [
  <>
    <Route exact path="/" element={<Dashboard />} />
    <Route path="/create" element={<InGameMenu />} />
    <Route path="/tactorius" element={<FrontPage />} />
    {/* <Route exact path="/" component={SinglePlayer} /> */}
    {/* <Route path="/about" component={About} /> */}
    {/* <Route path="/404" component={NotFound} /> */}
  </>,
];

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App routes={myRoutes} />
  </React.StrictMode>
);
