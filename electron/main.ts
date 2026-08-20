import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { pathToFileURL } from 'url';
import { createWindowStateStore } from './windowState';
import { registerMeetingIpc } from './meetingIpc';

const isDev = !app.isPackaged;
let mainWindow: BrowserWindow | null = null;
let companionWindow: BrowserWindow | null = null;

function loadRenderer(win: BrowserWindow, route: string) {
  if (isDev) {
    const hash = route ? `#/${route}` : '';
    win.loadURL(`http://127.0.0.1:5173/${hash}`);
    return;
  }
  const indexPath = path.join(app.getAppPath(), 'dist-renderer', 'index.html');
  const url = new URL(pathToFileURL(indexPath).href);
  if (route) url.hash = `/${route}`;
  win.loadURL(url.toString());
}

function createMainWindow() {
  const state = createWindowStateStore('main-window');
  const win = new BrowserWindow({
    width: state.width ?? 1200,
    height: state.height ?? 800,
    x: state.x,
    y: state.y,
    title: 'Sidekick',
    backgroundColor: '#f5f1ea',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.on('close', () => state.save(win));
  loadRenderer(win, '');
  return win;
}

function createCompanionWindow() {
  const state = createWindowStateStore('companion-window');
  const win = new BrowserWindow({
    width: state.width ?? 420,
    height: state.height ?? 640,
    x: state.x,
    y: state.y,
    frame: false,
    alwaysOnTop: true,
    resizable: true,
    movable: true,
    skipTaskbar: true,
    backgroundColor: '#f7f3ed',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.on('close', () => state.save(win));
  loadRenderer(win, 'companion');
  return win;
}

app.whenReady().then(() => {
  ipcMain.handle('window:companion:show', () => {
    if (!companionWindow || companionWindow.isDestroyed()) {
      companionWindow = createCompanionWindow();
    } else {
      companionWindow.show();
      companionWindow.focus();
    }
    return true;
  });
  registerMeetingIpc(ipcMain);
  mainWindow = createMainWindow();
  companionWindow = createCompanionWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
      companionWindow = createCompanionWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
