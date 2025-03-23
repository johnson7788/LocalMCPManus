import fs from 'fs';
import path from 'path';
import os from 'os'; // 新增导入os模块

// 辅助函数移到模块作用域
const getStoragePath = () => {
  const platformDirs = {
    win32: path.join('AppData', 'Roaming'),
    darwin: path.join('Document',),
    linux: path.join('.cache')
  };
  const baseDir = path.join(os.homedir(), platformDirs[process.platform] || platformDirs.linux, 'LocalMCPManus');
    // 已修改为使用 os.homedir()
  return path.join(baseDir, 'config.json');
};

export function initializeStorage() {
  console.log("初始化存储")
  const storagePath = getStoragePath();
  fs.mkdirSync(path.dirname(storagePath), { recursive: true });
  console.log("初始化存储完成,路径为: ",storagePath)
}

export function appendMessage(messageData: object) {
  try {
    console.log("写入消息",messageData)
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
  console.log("写入配置",config)
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
    const result = fs.existsSync(storagePath)
      ? JSON.parse(fs.readFileSync(storagePath, 'utf-8'))
      : {};
    console.log("读取配置",result)
    return result;
  } catch (error) {
    console.error('Read config failed:', error);
    return {};
  }
}