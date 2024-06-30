import React from "react";
import ReactDOM from "react-dom/client";

const App = () => {
  const sendNotification = () => {
    electron.notificationApi.sendMessage("Hi , there are some message");
  };

  return (
    <div>
      Hello world 123
      <button onClick={sendNotification}>Test</button>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
