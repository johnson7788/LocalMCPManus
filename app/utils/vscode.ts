import { WebviewMessage } from "../shared/WebviewMessage";

// 定义 VSCode API 的接口
interface VSCodeAPI {
  postMessage(message: any): void;
  getState<T>(): T | undefined;
  setState<T>(state: T): T;
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
        // 修复事件名称和参数结构（原storage-operation事件不存在）
        window.api.invoke('append-message', message); // 直接传递message对象
        console.log('存储 Code API 收到消息:', message);
      },
      getState<T>() {
        // 使用正确的IPC事件名称和参数
        return window.api.invoke('get-config-data');
      },
      setState<T>(newState: T) {
        // 使用正确的IPC事件名称和参数
        window.api.invoke('save-config-data', newState);
        console.log('存储 Code API 状态已更新:', newState);
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
