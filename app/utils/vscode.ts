import { WebviewMessage } from "../shared/WebviewMessage"

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

// 模拟 acquireVsCodeApi 函数
if (typeof acquireVsCodeApi !== 'function') {
  // 在全局对象上定义模拟函数
  (window as any).acquireVsCodeApi = function(): VSCodeAPI {
    let state: any = undefined;
    
    return {
      postMessage(message: any) {
        console.log('模拟 VS Code API 收到消息:', message);
      },
      getState<T>() {
        return state as T | undefined;
      },
      setState<T>(newState: T) {
        state = newState;
        console.log('模拟 VS Code API 状态已更新:', newState);
        return newState;
      }
    };
  };
}

class VSCodeAPIWrapper {
  // 修改类型定义
  private readonly vsCodeApi: VSCodeAPI | undefined

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
  public postMessage(message: WebviewMessage) {
    if (this.vsCodeApi) {
      this.vsCodeApi.postMessage(message)
    } else {
      console.log(message)
    }
  }

  /**
   * Get the persistent state stored for this webview.
   *
   * @remarks When running webview source code inside a web browser, getState will retrieve state
   * from local storage (https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
   *
   * @return The current state or `undefined` if no state has been set.
   */
  public getState(): unknown | undefined {
    if (this.vsCodeApi) {
      return this.vsCodeApi.getState()
    } else {
      const state = localStorage.getItem("vscodeState")
      return state ? JSON.parse(state) : undefined
    }
  }

  /**
   * Set the persistent state stored for this webview.
   *
   * @remarks When running webview source code inside a web browser, setState will set the given
   * state using local storage (https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
   *
   * @param newState New persisted state. This must be a JSON serializable object. Can be retrieved
   * using {@link getState}.
   *
   * @return The new state.
   */
  public setState<T extends unknown | undefined>(newState: T): T {
    if (this.vsCodeApi) {
      return this.vsCodeApi.setState(newState)
    } else {
      localStorage.setItem("vscodeState", JSON.stringify(newState))
      return newState
    }
  }
}

export const vscode = new VSCodeAPIWrapper()
