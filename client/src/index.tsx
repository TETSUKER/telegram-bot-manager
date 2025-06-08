import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const rootDomElement = document.getElementById("root");

if (rootDomElement) {
  const root = ReactDOM.createRoot(rootDomElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
