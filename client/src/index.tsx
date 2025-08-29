import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { store } from "store/store";
import { Provider } from "react-redux";

const rootDomElement = document.getElementById("root");

if (rootDomElement) {
  const root = ReactDOM.createRoot(rootDomElement);
  root.render(
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  );
}
