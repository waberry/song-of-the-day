import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "./components/Navbar";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./index.css";
import store from "./reducers/index.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Navbar />
      <App />
    </Provider>
  </React.StrictMode>,
);
