import { DefaultData } from './common';
import { IEventFunction, INewEventBus } from './eventbus';

interface IAppOptions<P extends JApp = JApp, Data = DefaultData<P>>
  extends App.AppInstance<Data> {}

type CombinedAppInstance<Instance extends JApp, Method> = Instance &
  Method &
  IAnyObject;

type ThisTypedAppOptions<P extends JApp, Method> = IAppOptions<P, Method> &
  Method &
  ThisType<CombinedAppInstance<P, Method>>;

export interface JApp extends Required<App.AppInstance>, INewEventBus {
  /** app onLauch or onShow 时参数  */
  readonly $appOptions: App.ILaunchShowOption;
}

interface IJAppConstructor<P extends JApp = JApp> {
  <Method = object>(options: ThisTypedAppOptions<P, Method>): void;
  mixin<Method = object>(obj: ThisTypedAppOptions<P, Method>): void;
  intercept(event: string, fn: IEventFunction): void;
  intercept(fn: IEventFunction): void;
}

export var JApp: IJAppConstructor;
