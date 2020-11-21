import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { configure } from "mobx";
import * as Sentry from '@sentry/browser';


import "./index.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";

import appStore from "./stores";

Sentry.init({
 dsn: "https://21fe5a20a1fa4e5ba8fee26ec9cec189@sentry.io/1380593"
});

configure({enforceActions: "always"})

const stores = {
  appStore
}

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
