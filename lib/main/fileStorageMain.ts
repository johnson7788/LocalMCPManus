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

//配置是{x:y}这样的object

export function updateOneConfig(newItem: any) {
    try {
      const storagePath = getStoragePath();
      console.log("更新配置",newItem)
      const configKey = newItem.type;
      const currentConfig = readConfig();
      currentConfig[configKey] = newItem;
      // 调用现有写入方法更新配置
      fs.writeFileSync(storagePath, JSON.stringify(currentConfig, null, 2));
      return true;
    } catch (error) {
      console.error('Update config failed:', error);
      return false;
    }
}

export function writeConfig(config: object) {
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
    const content = fs.readFileSync(storagePath, 'utf-8')
    if (content.length === 0) {
      return {}
    } else {
      return JSON.parse(content)
    }
  } catch (error) {
    console.error('Read config failed:', error);
    return {};
  }
}