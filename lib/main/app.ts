import { BrowserWindow, shell, app } from 'electron'
import { join } from 'path'
import { registerWindowIPC } from '@/app/window/ipcEvents'
import appIcon from '@/resources/build/icon.png?asset'
import { ipcMain } from 'electron';
import { readToolsData, saveToolsData } from './tool'; // 导入工具数据读取功能
import { readConfigData, saveConfigData, appendMessage } from './config'; // 导入配置数据读取功能

// 在createAppWindow函数开始处初始化
export function createAppWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    backgroundColor: '#1c1c1c',
    icon: appIcon,
    frame: false,
    titleBarStyle: 'hiddenInset',
    title: 'Electron React App',
    maximizable: false,
    resizable: false,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false,
    },
  })

  // Register IPC events for the main window.
  registerWindowIPC(mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

ipcMain.handle('get-tools-data', async () => {
  return readToolsData();
});

ipcMain.handle('save-tools-data', async (event, toolsData) => {
  return saveToolsData(toolsData);
});

ipcMain.handle('get-config-data', async () => {
  return readConfigData();
});
ipcMain.handle('save-config-data', async (event, configData) => {
  return saveConfigData(configData);
})
ipcMain.handle('append-message', async (event, message) => {
  return appendMessage(message);
})