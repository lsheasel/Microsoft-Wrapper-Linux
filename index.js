const { app, BrowserWindow, Menu } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800
  });

  // Menü komplett deaktivieren
  Menu.setApplicationMenu(null);

  // Optional: zusätzlich Menüleiste verbergen
  win.setMenuBarVisibility(false);

  win.loadURL('https://m365.cloud.microsoft/apps');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
