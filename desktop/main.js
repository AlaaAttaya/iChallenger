process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 720,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: true,
    },
    icon: path.join(__dirname, "assets/images/iChallenger.png"),
  });

  win.setMinimumSize(300, 300);

  win.loadFile(path.join(__dirname, "views/login.html"));
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

let websiteWindow = null;

ipcMain.on("open-website-window", () => {
  if (websiteWindow && !websiteWindow.isDestroyed()) {
    websiteWindow.close();
  }

  websiteWindow = new BrowserWindow({
    width: 1024,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: path.join(app.getAppPath(), "assets/images/iChallenger.png"),
  });

  websiteWindow.loadURL("https://localhost:3000");

  websiteWindow.show();
});
