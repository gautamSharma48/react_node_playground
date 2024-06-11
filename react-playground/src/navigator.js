import React from "react";
import { history } from "./history";

const Navigator = () => {
  const pathChecker = (value) => {
    switch (value) {
      case "redux":
        return history.push("/redux-route");
      case "axios":
        return history.push("/api-service-route");
      case "graph":
        return history.push("/graphs-route");
      case "ui-route":
        return history.push("/ui-route");
      case "animation":
        return history.push("/animation");
        case "figma":
          return history.push("/figma");
      default:
        return history.push("/");
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        className="border border-red-700 p-2"
        onClick={() => pathChecker("redux")}
      >
        Redux Route
      </button>
      <button
        className="border border-red-700 p-2"
        onClick={() => pathChecker("axios")}
      >
        Api service
      </button>
      <button
        className="border border-red-700 p-2"
        onClick={() => pathChecker("graph")}
      >
        Graphs
      </button>
      <button
        className="border border-red-700 p-2"
        onClick={() => pathChecker("ui-route")}
      >
        User Interface
      </button>
      <button
        className="border border-red-700 p-2"
        onClick={() => pathChecker("animation")}
      >
        Animation
      </button>
      <button
        className="border border-red-700 p-2"
        onClick={() => pathChecker("figma")}
      >
        Figma
      </button>
    </div>
  );
};

export default Navigator;
