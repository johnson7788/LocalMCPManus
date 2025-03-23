import fs from 'fs';
import path from 'path';
import os from 'os'; // 新增导入os模块

// 辅助函数移到模块作用域
const getStoragePath = () => {
  const platformDirs = {
    win32: path.join('AppData', 'Roaming'),
    darwin: path.join('Library', 'Application Support'),
    linux: path.join('.local', 'share')
  };
  const baseDir = path.join(os.homedir(), platformDirs[process.platform] || platformDirs.linux, 'LocalMCPManus');
    // 已修改为使用 os.homedir()
  return path.join(baseDir, 'config.json');
};

export function initializeStorage() {
  const storagePath = getStoragePath();
  fs.mkdirSync(path.dirname(storagePath), { recursive: true });
}

export function appendMessage(messageData: object) {
  try {
    const storagePath = getStoragePath();
    initializeStorage(); // 确保目录存在
    
    let currentData = fs.existsSync(storagePath) 
      ? JSON.parse(fs.readFileSync(storagePath, 'utf-8'))
      : { messages: [] };

    currentData.messages = [
      ...(currentData.messages || []),
      {
        timestamp: new Date().toISOString(),
        ...messageData
      }
    ];
    
    fs.writeFileSync(storagePath, JSON.stringify(currentData, null, 2));
    return true;
  } catch (error) {
    console.error('Append message failed:', error);
    return false;
  }
}

export function writeConfig(config: Record<string, any>) {
  try {
    const storagePath = getStoragePath();
    initializeStorage();
    
    const currentData = fs.existsSync(storagePath)
      ? JSON.parse(fs.readFileSync(storagePath, 'utf-8'))
      : {};
    
    const mergedData = { ...currentData, ...config };
    fs.writeFileSync(storagePath, JSON.stringify(mergedData, null, 2));
    return true;
  } catch (error) {
    console.error('Write config failed:', error);
    return false;
  }
}

export function readConfig() {
  try {
    const storagePath = getStoragePath();
    return fs.existsSync(storagePath)
      ? JSON.parse(fs.readFileSync(storagePath, 'utf-8'))
      : {};
  } catch (error) {
    console.error('Read config failed:', error);
    return {};
  }
}