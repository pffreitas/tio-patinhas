import React from 'react';
import firebase from 'firebase';
import { Router, Route, IndexRoute } from 'react-router';
import {UserActions} from './actions';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Template from './pages/template.jsx';
import HomePage from './pages/home.jsx';
import PlanejamentoPage from './pages/planejamento.jsx';

var app = firebase.initializeApp({
  apiKey: "AIzaSyDrFnpxeeFiwbFzSJmIVbT1iiVIX1X6XnE",
  authDomain: "tio-patinhas.firebaseapp.com",
  databaseURL: "https://tio-patinhas.firebaseio.com",
  storageBucket: "tio-patinhas.appspot.com",
});

injectTapEventPlugin(); 

function auth(){
  UserActions.login();
}

const App = () => {
  return (
    <Router>
      <Route component={Template}>
        <IndexRoute component={HomePage} />
        <Route path="/" component={HomePage} onEnter={auth} />
        <Route path="/plan" component={PlanejamentoPage} onEnter={auth} />
      </Route>
    </Router>
  );
};

App.displayName = 'App';

export default App;
