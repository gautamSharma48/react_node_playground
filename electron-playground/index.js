import React from "react";
import ReactDOM from "react-dom/client";
import App from "./src/App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";


const root = ReactDOM.createRoot(document.getElementById("chatApp"));
root.render(<App />);
