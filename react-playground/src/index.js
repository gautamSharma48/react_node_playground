import React from "react";
import ReactDOM from "react-dom/client";
import ReduxRoute from "./redux/main.jsx";
import ServiceRoute from "./service/main.jsx"
import GraphsRoute from "./graphs/main.jsx"
import UIComponentsRoute from "./uiComponents/main.jsx"
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import {
  unstable_HistoryRouter as HistoryRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { history } from "./history";
import Navigator from "./navigator.js";
import "./index.css"
import Figma from "./figma/index.jsx";
import DevExpress from "./devExpress/index.jsx";

const AuthContext = () => {
  const token = true;
  if (!token) {
    return history.push("/login");
  }
  return <Outlet />;
};

const Router = () => {
  return (
    <Routes>
      <Route path="/redux-route" element={<ReduxRoute />} />
      <Route path="/api-service-route" element={<ServiceRoute />} />
      <Route path="/graphs-route" element={<GraphsRoute />} />
      <Route path="/ui-route" element={<UIComponentsRoute />} />
      <Route path="/figma" element={<Figma />} />
      <Route path="/dev-express" element={<DevExpress />} />
      <Route element={<AuthContext />}>
        <Route path="/" element={<Navigator />} />
      </Route>
      <Route path="*" element={<Navigate to={"/"} replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    // setup routes
    <HistoryRouter history={history}>  
    {/* // setup redux store */}
      <Provider store={store}> 
      {/* // setup redux- persist store */}
        <PersistGate persistor={persistor}>
          <Router />
        </PersistGate>
      </Provider>
    </HistoryRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
