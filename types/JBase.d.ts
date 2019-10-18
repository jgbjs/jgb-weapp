import { IEventFunction } from './eventbus';
export interface JBase {
  /**
   * 定时器会在页面、组件销毁时清空
   */
  $setTimeout(fn: IEventFunction, timeout?: number): any;
  /**
   * 定时器会在页面、组件销毁时清空
   */
  $setInterval(fn: IEventFunction, timeout?: number): any;
}
