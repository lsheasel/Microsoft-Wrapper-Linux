const { app, BrowserWindow, Menu } = require('electron');

app.commandLine.appendSwitch('disable-gpu'); // GPU deaktivieren (Linux hilft das oft)

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  // User-Agent anpassen, damit Teams besser läuft
  win.webContents.setUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
  );

  win.loadURL('https://m365.cloud.microsoft/apps');

  // Neue Fenster blockieren → URL im selben Fenster laden
  win.webContents.setWindowOpenHandler(({ url }) => {
    win.loadURL(url);
    return { action: 'deny' };
  });

  // Menü mit Zurück/Vorwärts und Entwickler-Tools Shortcut
  const customMenu = Menu.buildFromTemplate([
    {
      label: '🡸 ',
      click: () => {
        if (win.webContents.canGoBack()) win.webContents.goBack();
      }
    },
    {
      label: ' 🡺',
      click: () => {
        if (win.webContents.canGoForward()) win.webContents.goForward();
      }
    }
  ]);

  Menu.setApplicationMenu(customMenu);

  // Alt+←/→ Shortcuts für Navigation
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
