const  { contextBridge, ipcRenderer }  = require("electron");


// best way to define preload to work with render and main process
contextBridge.exposeInMainWorld("electron", {
  notificationApi: {
    sendMessage(message) {
      ipcRenderer.send("notify", message); // it will create emit event for main process
    },
  },
});



// this not good way to communicate between render and main process due to security policy
// window.sendNotification = () => {
//     ipcRenderer.send("notify", message); // it will create emit event for main process
// }