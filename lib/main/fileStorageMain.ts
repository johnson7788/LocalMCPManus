import fs from 'fs';
import path from 'path';

// 辅助函数移到模块作用域
const getStoragePath = () => {
  const platformDirs = {
    win32: path.join('AppData', 'Roaming'),
    darwin: path.join('Library', 'Application Support'),
    linux: path.join('.local', 'share')
  };
  const baseDir = process.env.SAVE_DIR 
    ? path.resolve(process.env.SAVE_DIR.replace(/^~/, process.env.HOME))
    : path.join(process.env.HOME!, platformDirs[process.platform] || platformDirs.linux, 'LocalMCPManus');
    
  return path.join(baseDir, 'config.json');
};

export function initializeStorage() {
  const storagePath = getStoragePath();
  fs.mkdirSync(path.dirname(storagePath), { recursive: true });
}

type StorageOperation = {
  key: string
  data?: any
}

export function initFileStorage(): void {
  function performStorageOperation({ key, data }: StorageOperation) {
    const storagePath = getStoragePath();
    
    try {
      let currentData = {};
      
      if (fs.existsSync(storagePath)) {
        currentData = JSON.parse(fs.readFileSync(storagePath, 'utf-8'));
      }

      switch (key) {
        case 'appendMessage':
          const messages = currentData.messages || [];
          currentData.messages = [...messages, {
            timestamp: new Date().toISOString(),
            ...data
          }];
          break;
        case 'writeConfig':
          currentData = { ...currentData, ...data };
          break;
        case 'readConfig':
          return currentData; // 直接返回读取的数据
      }

      fs.writeFileSync(storagePath, JSON.stringify(currentData, null, 2));
      return key === 'readConfig' ? currentData : true;
    } catch (error) {
      console.error('Storage operation failed:', error);
      return false;
    }
  }
}

export function appendMessage(messageData: Omit<StorageOperation, 'key'>) {
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
        ...messageData.data
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