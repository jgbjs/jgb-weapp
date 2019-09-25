import { Accessors } from './common';
import { IEventFunction } from './eventbus';
import { JPage, ThisTypedPageOptionsWithArrayProps } from './JPage';
type DefaultProps = Record<string, any>;
type IAnyObject = wxNS.IAnyObject;

type Prop<T> = (() => T) | { new (...args: any[]): T & object };

type DataDef<Data, Props, P> = Data | ((this: Readonly<Props> & P) => Data);

interface PropOptions<T, U> {
  /**
   * 属性的类型
   * 属性的类型可以为 String Number Boolean Object Array 其一，也可以为 null 表示不限制类型。
   */
  type?: Prop<T> | Array<Prop<T>>;
  /**
   * 属性的初始值
   */
  value?: T | null | undefined;
  /**
   * 属性值变化时的回调函数
   * 目前，在新版本基础库中不推荐使用这个字段，而是使用 Component 构造器的 observers 字段代替，它更加强大且性能更好。
   */
  observer?: (newVal: any, oldVal: any, changedPath: string) => any;
}

type PropValidator<T, U> = PropOptions<T, U> | Prop<T> | Array<Prop<T>>;

type RecordPropsDefinition<T, U> = { [K in keyof T]: PropValidator<T[K], U> };

type PropsDefinition<T, U> = RecordPropsDefinition<T, U>;

type PageInstance = Required<
  ThisTypedPageOptionsWithArrayProps<
    JPage,
    Record<string, any>,
    IAnyObject,
    IAnyObject
  >
>;

type CombinedJComponentInstance<
  Instance extends JComponent,
  Data,
  Method,
  Props,
  Computed
> = DefaultProps & { data: Data & DefaultProps & Props & Computed } & Instance &
  Method & { properties: Props } & {
    /** 组件所属页面实例  */
    $page: PageInstance;
  };

type ThisTypedJComponentOptionsWithArrayProps<
  P extends JComponent,
  Data,
  Methods,
  Props,
  Computed
> = object &
  JComponentOptions<
    P,
    DataDef<Data, Props, P>,
    Methods,
    Props,
    Computed,
    CombinedJComponentInstance<P, Data, Methods, Readonly<Props>, Computed>
  > &
  ThisType<
    CombinedJComponentInstance<P, Data, Methods, Readonly<Props>, Computed>
  >;

type WxComponentOptions = Partial<wxNS.Component.OtherOption> &
  Partial<wxNS.Component.Lifetimes>;

/**
 * JComponent 实现的接口对象
 */
interface JComponentOptions<P, Data, Methods, Props, Computed, Instance>
  extends WxComponentOptions {
  /**
   * 开发者可以添加任意的函数或数据到 object 参数中，
   * 在页面的函数中用 this 可以访问
   */
  [key: string]: any;
  /**
   * 组件的对外属性，是属性名到属性设置的映射表，
   * 属性设置中可包含三个字段，
   * type 表示属性类型、
   * value 表示属性初始值、
   * observer 表示属性值被更改时的响应函数
   *
   * @type {wx.IData}
   * @memberof JComponentOptions
   */
  properties?: PropsDefinition<Props, Instance>;

  /**
   * 计算属性
   * 需要指定显示声明returntype
   * @example
```js
 computed: {
  priceWithCurrency():string {
     return '$' + this.data.price
  }
}
```
   *
   * @type {Accessors<Computed>}
   * @memberof JComponentOptions
   */
  computed?: Accessors<Computed>;
  /**
   * 组件的内部数据，和 properties 一同用于组件的模版渲染
   *
   * @type {wx.IData}
   * @memberof JComponentOptions
   */
  data?: Data;
  /**
   * 组件的方法，包括事件响应函数和任意的自定义方法，关于事件响应函数的使用
   *
   * @type {wx.IData}
   * @memberof JComponentOptions
   */
  methods?: Methods;
  /**
   * 类似于mixins和traits的组件间代码复用机制
   *
   * @type {(string[] | any[])}
   * @memberof JComponentOptions
   */
  behaviors?: string[] | any[];
  /**
   *  组件生命周期函数，在组件实例进入页面节点树时执行，
   *  注意此时不能调用 setData
   *
   * @memberof JComponentOptions
   */
  created?(): void;
  /**
   * 组件生命周期函数，在组件实例进入页面节点树时执行
   *
   * @memberof JComponentOptions
   */
  attached?(): void;
  /**
   * 组件生命周期函数，在组件布局完成后执行，
   * 此时可以获取节点信息（使用 SelectorQuery ）
   *
   * @memberof JComponentOptions
   */
  ready?(): void;
  /**
   * 组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
   *
   * @memberof JComponentOptions
   */
  moved?(): void;
  /**
   * 组件生命周期函数，在组件实例被从页面节点树移除时执行
   *
   * @memberof JComponentOptions
   */
  detached?(): void;
}

/**
 * JComponent的构造方法
 */
interface IJComponentConstructor<P extends JComponent = JComponent> {
  <
    Data = Record<string, any>,
    Methods = object,
    Props = object,
    Computed = object
  >(
    opts: ThisTypedJComponentOptionsWithArrayProps<
      P,
      Data,
      Methods,
      Props,
      Computed
    >
  ): any;
  mixin<
    Data = Record<string, any>,
    Methods = object,
    Props = IAnyObject,
    Computed = IAnyObject
  >(
    obj: ThisTypedJComponentOptionsWithArrayProps<
      P,
      Data,
      Methods,
      Props,
      Computed
    >
  ): void;
  intercept(event: string, fn: IEventFunction): void;
  intercept(fn: IEventFunction): void;
}

export interface IJComponent extends wxNS.Component.InstanceMethods<any> {}

interface JComponent extends IJComponent {}

export let JComponent: IJComponentConstructor;
