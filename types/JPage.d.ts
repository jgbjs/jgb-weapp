import { Accessors, DefaultData } from './common';
import { IEventFunction, INewEventBus } from './eventbus';
import { Router } from './router';
import { JBase } from './JBase';

type DefaultComputed = { [key: string]: any };
type IAnyObject = wxNS.IAnyObject;

type WxPageOptions = Partial<wxNS.Page.ILifetime>;
type ISetData = wxNS.Component.InstanceMethods<any>['setData'];

interface IPageOptions<
  P extends JPage = JPage,
  Data = DefaultData<P>,
  Computed = DefaultComputed
> extends WxPageOptions {
  data?: Data;
  /**
   * 计算属性, 类似Vue
   * 需要指定方法的类型
   * @example
``` js
 {
   computed: {
     priceWithCurrency():string {
        return '$' + this.data.price
     }
   }
 }
```
   */
  computed?: Accessors<Computed>;
}

interface IPageInstanceExt {
  readonly $route: {
    path: string;
    params: any;
    query: any;
    hash: '';
    fullPath: string;
    name: string;
  };
  /** vue-router  */
  readonly $router: typeof Router;
  /** 打开当前页面路径中的参数 */
  readonly $options: IAnyObject;
  /**
   * @deprecated 请使用route但须考虑兼容
   */
  __route__: string;
  /**
   * 滚动到指定元素
   * @param selector 元素selector
   * @param ctx ctx作用域默认是当前页面
   */
  $scrollIntoView(selector: string, ctx?: any): Promise<any>;
  setData: ISetData;
}

export interface JPage
  extends Required<Pick<wxNS.Page.InstanceProperties, 'is' | 'route'>>,
    INewEventBus,
    JBase,
    IPageInstanceExt {}

type CombinedPageInstance<Instance extends JPage, Data, Method, Computed> = {
  data: Data & Computed;
} & Instance &
  Method &
  IAnyObject;

export type ThisTypedPageOptionsWithArrayProps<
  P extends JPage,
  Data extends Record<string, any>,
  Method,
  Computed
> = IPageOptions<P, Data, Computed> &
  Method &
  ThisType<CombinedPageInstance<P, Data, Method, Computed>>;

interface IJPageConstructor<P extends JPage = JPage> {
  <Data = Record<string, any>, Method = object, Computed = object>(
    opts: ThisTypedPageOptionsWithArrayProps<P, Data, Method, Computed>
  ): void;
  /**
   * Mixin
   * @param obj
   * @example
   *  JPage.mixin({
   *    onLoad() {
   *      // do something
   *    }
   *  })
   */
  mixin<Data = Record<string, any>, Method = object, Computed = object>(
    obj: ThisTypedPageOptionsWithArrayProps<P, Data, Method, Computed>
  ): void;
  /**
   * 拦截Page某个方法，除了onLoad
   * @example
   *  JPage.intercept('onShow', () => {})
   */
  intercept(event: string, fn: IEventFunction): void;
  /**
   * 拦截整个Page的参数
   * @example
   *  JPage.intercept(function(opts){
   *    opts.onLoad = () => {}
   *    return opts;
   *  })
   */
  intercept(fn: IEventFunction): void;
}

export var JPage: IJPageConstructor;
