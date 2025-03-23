import { WebviewMessage } from "../shared/WebviewMessage";

// 定义 VSCode API 的接口
interface VSCodeAPI {
  postMessage(message: any): void;
  getState<T>(): Promise<T | undefined>; // 添加 Promise 包装
  setState<T>(state: T): Promise<T>;      // 添加 Promise 包装
}

// 添加全局声明
declare global {
  function acquireVsCodeApi(): VSCodeAPI;
}

// 
if (typeof acquireVsCodeApi !== 'function') {
  (window as any).acquireVsCodeApi = function(): VSCodeAPI {
    return {
      postMessage(message: any) {
        console.log('postMessage: 存储 Code API 收到消息:', message);
        window.api.invoke('append-message', message);
        console.log('append-message: 存储 Code API 收到消息:', message);
      },
      getState() {
        return window.api.invoke('get-config-data').then(data => data || undefined); // 添加undefined处理
      },
      setState(newState: any) {  // 移除 <T>，改用具体类型
        window.api.invoke('save-config-data', newState);
        console.log('save-config-data: 存储 Code API 状态已更新:', newState);
        return newState;
      }
    };
  };
}

class VSCodeAPIWrapper {
  private readonly vsCodeApi: VSCodeAPI | undefined;

  constructor() {
    // 检查 acquireVsCodeApi 函数是否存在并获取 API
    if (typeof acquireVsCodeApi === 'function') {
      this.vsCodeApi = acquireVsCodeApi();
    } else {
      this.vsCodeApi = undefined;
    }
  }

  /**
   * Post a message (i.e. send arbitrary data) to the owner of the webview.
   *
   * @remarks When running webview code inside a web browser, postMessage will instead
   * log the given message to the console.
   *
   * @param message Abitrary data (must be JSON serializable) to send to the extension context.
   */
  public async postMessage(message: WebviewMessage) {
    if (this.vsCodeApi) {
      this.vsCodeApi.postMessage(message);
    } else {
      // 修复参数结构（原参数嵌套了不必要的key字段）
      await window.api.invoke('append-message', message);
      console.log(message);
    }
  }

  public async getState(): Promise<unknown> {
    return this.vsCodeApi 
      ? this.vsCodeApi.getState()
      : window.api.invoke('get-config-data'); // 移除冗余参数
  }

  public async setState<T extends unknown>(newState: T): Promise<T> {
    if (this.vsCodeApi) {
      return this.vsCodeApi.setState(newState);
    }
    // 使用正确的参数格式
    await window.api.invoke('save-config-data', newState);
    return newState;
  }
}

export const vscode = new VSCodeAPIWrapper()
