import { App } from "components";
import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import "./styles/index.scss";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// // Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// // Learn more: https://www.snowpack.dev/#hot-module-replacement
// if (import.meta.hot) {
//   import.meta.hot.accept();
// }
