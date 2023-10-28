import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  // Redirect,
  // withRouter,
} from 'react-router-dom';

import '@fontsource/exo';
import '@fontsource/exo/400-italic.css';
import '@fontsource/exo/700-italic.css';

// Import your components/pages here
import { FrontPage } from '././pages/frontPage/FrontPage';
import { InGameMenu } from '././pages/inGameMenu/InGameMenu';
import { SinglePlayer } from '././pages/singlePlayer/SinglePlayer';
import { Dashboard } from '././pages/dashboard/Dashboard';

interface AppProps {
  location: string;
}

class App extends React.Component {
  render() {
    return (
      <></>
      // <Router>
      //   <RouteComponent />
      // </Router>
    );
  }
}

const RouteComponent = () => {
  // return (
  //   // <div>
  //   //   <Route exact path="/" component={Dashboard} />
  //   //   <Route exact path="/create" component={InGameMenu} />
  //   //   <Route exact path="/" component={SinglePlayer} />
  //   //   <Route exact path="/" component={FrontPage} />
  //   //   <Route path="/about" component={About} />
  //   //   <Route path="/404" component={NotFound} />
  //   //   {/* <Redirect to="/404" /> */}
  //   // </div>
  // );
};

export default App;

// import React from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Switch,
//   withRouter,
// } from "react-router-dom";
// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
// // import { CSSTransition, TransitionGroup } from "react-transition-group";

// import "./styles/app.css";

// // import { InGameWrapper } from "./components/InGameWrapper";

// import "@fontsource/exo";
// import "@fontsource/exo/400-italic.css";
// import "@fontsource/exo/700-italic.css";

// // import { store, persistor } from "./store/configureStore";

// // import jwt_decode from "jwt-decode";
// // import setAuthToken from "./utils/setAuthToken";
// // import { setCurrentUser, logoutUser } from "./actions/authActions";

// // import {
// //   FrontPage,
// //   Home,
// //   Profile,
// //   DeltaMenu,
// //   TemplateMaker,
// //   Campaign,
// //   Chapter,
// //   LessonView,
// //   QuizView,
// //   MissionView,
// //   LoginReg,
// //   Learn,
// //   Forum,
// //   Versus,
// //   VersusTactorius,
// //   Lobby,
// // } from "./pages";
// import PrivateRoute from "./components/privateRoute/PrivateRoute";

// // Check for token to keep user logged in
// // if (localStorage.jwtToken) {
// //   // Set auth token header auth
// //   const token = localStorage.jwtToken;
// //   setAuthToken(token);

// //   // Decode token and get user info and exp
// //   const decoded = jwt_decode(token);

// //   // Set user and isAuthenticated
// //   store.dispatch(setCurrentUser(decoded));

// //   // Check for expired token
// //   const currentTime = Date.now() / 1000; // to get in milliseconds

// //   if (decoded.exp < currentTime) {
// //     // Logout user
// //     store.dispatch(logoutUser());

// //     // Redirect to login
// //     window.location.href = "./";
// //   }
// // }

// class App extends React.Component {
//   render() {
//     return (
//       //<Provider store={store}>
//         //<PersistGate loading={null} persistor={persistor}>
//           <Router>
//             <RouteComponent />
//           </Router>
//         //</PersistGate>
//       //</Provider>
//     );
//   }
// }

// const RouteComponent = withRouter(({ location }) => {
//   return (
//     // <InGameWrapper>
//       {/* <TransitionGroup> */}
//       {/* <CSSTransition key={location.key} classNames="fade" timeout={300}> */}
//       <Switch location={location}>
//         {/* <Route exact path="/" component={FrontPage} /> */}
//         {/* <Route path="/authenticate" component={LoginReg} /> */}
//         {/* <Route path="/register" component={RegisterPanel} /> */}
//         {/* <PrivateRoute path="/dashboard" component={Home} /> */}
//         {/* <PrivateRoute path="/profile" component={Profile} /> */}
//         {/* <PrivateRoute path="/campaign" component={Campaign} /> */}
//         {/* todo: nested routes? */}
//         {/* <PrivateRoute path="/campaign" component={Campaign} /> */}
//         {/* <PrivateRoute path="/chapter" component={Chapter} /> */}
//         {/* <PrivateRoute path="/lesson" component={LessonView} /> */}
//         {/* <PrivateRoute path="/quiz" component={QuizView} /> */}
//         {/* <PrivateRoute path="/mission" component={MissionView} /> */}
//         {/* <PrivateRoute path="/dojo" component={Dojo} /> */}
//         {/* <PrivateRoute path="/learn" component={Learn} /> */}
//         {/* <PrivateRoute path="/sandbox" component={DeltaMenu} /> */}
//         {/* <PrivateRoute path="/create" component={TemplateMaker} /> */}
//         {/* <PrivateRoute path="/forum" component={Forum} /> */}
//         {/* <PrivateRoute path="/versus" component={Versus} /> */}
//         {/* <PrivateRoute
//               path="/lobby"
//               // render={(props) => {
//               //   return <Lobby {...props} />
//               // }}
//               component={Lobby}
//             /> */}
//         {/* TODO: ANALYSIS ONLY CATCHES WHEN PUT BEFORE GAMEROOM */}
//         {/* <PrivateRoute
//             path="/analysis/:id"
//             // render={(props) => {
//             //   return <AnalysisRoom key={props.location.key} {...props} />
//             // }}
//             component={AnalysisRoom}
//           /> */}
//         {/* <PrivateRoute
//               path="/game/:id"
//               // render={(props) => {
//               //   if (props.match.url !== '/lobby') {
//               //     return <GameRoom key={props.location.key} {...props} />
//               //   }
//               // }}
//               component={VersusTactorius}
//             /> */}
//       </Switch>
//       {/* </CSSTransition> */}
//       {/* </TransitionGroup> */}
//     // </InGameWrapper>
//   );
// });

// export default App;
