const { app, BrowserWindow, Notification } = require("electron");
const { ipcMain } = require("electron/main");
const path = require("path");

const isDev = app.isPackaged;

function createBrowserWindow() {
  // create configuration for browser window for view
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: "white",
    webPreferences: {
      nodeIntegration: false,
      devTools: true, // show the dev tools inside the browser window

      //it's features that ensure preload the script and electron internal logic run in seperate
      contextIsolation: true, // isolate window object inside the main process
      preload: path.join(__dirname,"preload.js")
    },
  });

 
  isDev && win.webContents.openDevTools();
  win.loadFile("index.html"); // load html file inside browser window
}

ipcMain.on("notify",(_,message)=>{
  new Notification({title: "Notification", body: message}).show();
})

if(isDev){
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
  });
}

app.whenReady().then(()=>{
  createBrowserWindow();
  const notification = new Notification({ title: "Hello World", body: "my test 123"});
  notification.show();

  setTimeout(()=>{
    notification.close();
  },2000)

}); // when app is ready then create Browserwinodw


// app.on('window-all-closed', ()=>{
//   if(process.platform !== "win32"){
//     app.quit();
//   }
// })

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createBrowserWindow();
  }
});
