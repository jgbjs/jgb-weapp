import { IEventFunction, INewEventBus } from './eventbus';
export interface JBase {
  /**
   * 定时器会在页面、组件销毁时清空
   */
  $setTimeout(fn: IEventFunction, timeout?: number): any;
  /**
   * 定时器会在页面、组件销毁时清空
   */
  $setInterval(fn: IEventFunction, timeout?: number): any;
  /**
   * !!! 注意如果不传 `busInstance` 默认是全局的 `bus`
   *
   * 向 `Page` 或者 `Component` 添加 `eventBusId`, 在销毁时自动 `off`
   */
  $addBusId(ids: number | number[], busInstance?: INewEventBus): any;
}
