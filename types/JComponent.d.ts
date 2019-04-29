import { Accessors } from './common';
import { IEventFunction } from './eventbus';
type DefaultProps = Record<string, any>;

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

type CombinedJComponentInstance<
  Instance extends JComponent,
  Data,
  Method,
  Props,
  Computed
> = DefaultProps & { data: Data & DefaultProps & Props & Computed } & Instance &
  Method & { properties: Props };

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

/**
 * JComponent 实现的接口对象
 */
interface JComponentOptions<P, Data, Methods, Props, Computed, Instance> {
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
  relations?: {
    [key: string]: {
      /** 目标组件的相对关系  */
      type: 'parent' | 'child' | 'ancestor' | 'descendant';
      /** 关系生命周期函数，当关系被建立在页面节点树中时触发，触发时机在组件attached生命周期之后 */
      linked?: (target: any) => void;
      /** 关系生命周期函数，当关系在页面节点树中发生改变时触发，触发时机在组件moved生命周期之后  */
      linkChanged?: (target: any) => void;
      /** 关系生命周期函数，当关系脱离页面节点树时触发，触发时机在组件detached生命周期之后  */
      unlinked?: (target: any) => void;
      /** 如果这一项被设置，则它表示关联的目标节点所应具有的behavior，所有拥有这一behavior的组件节点都会被关联  */
      target?: string;
    };
  };
  /**
   * 组件接受的外部样式类
   *
   * @type {*}
   * @memberof JComponentOptions
   */
  externalClasses?: string[];
  /** 一些组件选项，请参见文档其他部分的说明  */
  options?: any;
  /**
   * 组件生命周期声明对象，组件的生命周期：
   * created、attached、ready、moved、detached将收归到lifetimes字段内进行声明，
   * 原有声明方式仍旧有效，如同时存在两种声明方式，则lifetimes字段内声明方式优先级最高
   *
   * @version 2.2.3
   * @type {*}
   * @memberof JComponentOptions
   */
  lifetimes?: any;
  /**
   * 组件所在页面的生命周期声明对象，目前仅支持页面的show和hide两个生命周期
   *
   * @version 2.2.3
   * @type {*}
   * @memberof JComponentOptions
   */
  pageLifetimes?: any;
  /**
   * 定义段过滤器，用于自定义组件扩展
   *
   * @version 2.2.3
   * @memberof JComponentOptions
   */
  definitionFilter?(): void;
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
  mixin(obj: any): void;
  intercept(event: string, fn: IEventFunction): void;
  intercept(fn: IEventFunction): void;
}

export interface IJComponent {
  /**
   * 设置data并执行视图层渲染
   *
   * @param {*} data
   * @memberof IJComponent
   */
  setData(data: any): void;
  /**
   * 检查组件是否具有 behavior （检查时会递归检查被直接或间接引入的所有behavior）
   *
   * @param {*} behavior
   * @returns {boolean}
   * @memberof IJComponent
   */
  hasBehavior(behavior: any): boolean;
  /**
   * 触发事件
   *
   * @param {string} name
   * @param {*} detail
   * @param {*} options
   * @memberof IJComponent
   */
  triggerEvent(
    name: string,
    detail?: any,
    options?: {
      bubbles?: boolean;
      composed?: boolean;
    }
  ): void;
  /**
   * 创建一个 SelectorQuery 对象，选择器选取范围为这个组件实例内
   *
   * @returns {wx.SelectQuery}
   * @memberof IJComponent
   */
  createSelectorQuery: wxNS.Wx['createSelectorQuery'];
  /**
   * 使用选择器选择组件实例节点，
   * 返回匹配到的第一个组件实例对象（会被 wx://component-export 影响）
   *
   * @param {string} selector
   * @returns {*}
   * @memberof IJComponent
   */
  selectComponent(selector: string): any;
  /**
   * 	使用选择器选择组件实例节点，
   *  返回匹配到的全部组件实例对象组成的数组
   *
   * @param {string} selector
   * @returns {*}
   * @memberof IJComponent
   */
  selectAllComponents(selector: string): any;
  /**
   * 获取所有这个关系对应的所有关联节点
   *
   * @param {string} relationKey
   * @returns {*}
   * @memberof IJComponent
   */
  getRelationNodes(relationKey: string): any;
}

interface JComponent extends IJComponent {}

export let JComponent: IJComponentConstructor;
