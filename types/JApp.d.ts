import { DefaultData } from './common';
import { IEventFunction, INewEventBus } from './eventbus';

type IAnyObject = wxNS.IAnyObject;
type WxAppOptions = Partial<wxNS.App.Option>;

interface IAppOptions<P extends JApp = JApp, Data = DefaultData<P>>
  extends WxAppOptions {}

type CombinedAppInstance<Instance extends JApp, Method> = Instance &
  Method &
  IAnyObject;

type ThisTypedAppOptions<P extends JApp, Method> = IAppOptions<P, Method> &
  Method &
  IAnyObject &
  ThisType<CombinedAppInstance<P, Method>>;

export interface JApp extends Required<wxNS.App.Option>, INewEventBus {
  /** app onLauch or onShow 时参数  */
  readonly $appOptions: wxNS.App.LaunchShowOption;
}

interface IJAppConstructor<P extends JApp = JApp> {
  <Method = object>(options: ThisTypedAppOptions<P, Method>): void;
  mixin<Method = object>(obj: ThisTypedAppOptions<P, Method>): void;
  intercept(event: string, fn: IEventFunction): void;
  intercept(fn: IEventFunction): void;
}

export var JApp: IJAppConstructor;
