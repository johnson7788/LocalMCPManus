import { WebviewMessage } from "../shared/WebviewMessage";

class VSCodeAPIWrapper {

  /**
   * Post a message (i.e. send arbitrary data) to the owner of the webview.
   *
   * @remarks When running webview code inside a web browser, postMessage will instead
   * log the given message to the console.
   *
   * @param message Abitrary data (must be JSON serializable) to send to the extension context.
   */
  public async postMessage(message: WebviewMessage) {
    console.log('postMessage: 更新一条配置信息:', message);
    // 修复参数结构（原参数嵌套了不必要的key字段）
    await window.api.invoke('append-message', message);
    console.log(message);
  }

  public async getState(): Promise<unknown> {
    console.log('getState: 获取配置信息');
    return window.api.invoke('get-config-data'); // 移除冗余参数
  }

  public async setState<T extends unknown>(newState: T): Promise<T> {
    // 使用正确的参数格式
    console.log('setState: 存储 Code API 收到消息:', newState);
    await window.api.invoke('save-config-data', newState);
    return newState;
  }
}

export const vscode = new VSCodeAPIWrapper()
