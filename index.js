const { app, BrowserWindow, Menu } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  win.loadURL('https://m365.cloud.microsoft/apps');

  // 🔁 Neue Fenster blockieren → URL im selben Fenster laden
  win.webContents.setWindowOpenHandler(({ url }) => {
    win.loadURL(url);
    return { action: 'deny' };
  });

  // ⬅️➡️ Eigenes Menü mit Zurück/Vorwärts
  const customMenu = Menu.buildFromTemplate([
    {
      label: '🡸 ',
      click: () => {
        if (win.webContents.canGoBack()) {
          win.webContents.goBack();
        }
      }
    },
    {
      label: ' 🡺',
      click: () => {
        if (win.webContents.canGoForward()) {
          win.webContents.goForward();
        }
      }
    }
  ]);

  Menu.setApplicationMenu(customMenu); // setzt dein eigenes Menü

  // Optional: Alt+←/→ auch als Shortcut
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'ArrowLeft' && input.alt) {
      if (win.webContents.canGoBack()) win.webContents.goBack();
    }
    if (input.type === 'keyDown' && input.key === 'ArrowRight' && input.alt) {
      if (win.webContents.canGoForward()) win.webContents.goForward();
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});