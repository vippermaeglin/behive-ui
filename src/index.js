import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Auth0Provider } from './auth/react-auth0-spa';

import App from './App';
import * as serviceWorker from './serviceWorker';
import auth0Config from './auth/auth0.config.json';

//import './App.css';
import './assets/scss/style.scss';

const history = createBrowserHistory();

ReactDOM.render(
  <Auth0Provider
    domain={auth0Config.domain}
    client_id={auth0Config.clientId}
    audience={auth0Config.audience}
    redirect_uri={window.location.origin}
  >
    <Router history={history}>
      <App />
    </Router>
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
