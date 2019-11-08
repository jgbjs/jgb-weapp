import { IEventFunction } from '../types/eventbus';
import JBase, { event } from './JBase';
import { getCurrentPage, isSupportVersion, noop } from './utils';
import {
  ADD_HIDE_HANDLER,
  ADD_SHOW_HANDLER,
  ALL_COMPONENTS,
  HIDE_HANDLER,
  SHOW_HANDLER
} from './utils/const';
import expand, { INIT } from './utils/expand';
import { hook } from './utils/hook';

// @ts-ignore
@expand('created')
export default class JComponent extends JBase {
  static mixin: (obj: any) => void;
  static intercept: (event: string, fn: IEventFunction) => void;
  static [INIT]: (...data: any[]) => any;
  constructor(opts?: any) {
    super();
    if (!(this instanceof JComponent)) {
      return new JComponent(opts);
    }

    // 判断是否支持pageLifetimes
    if (opts.pageLifetimes && !isSupportVersion('2.2.3')) {
      const { show = noop, hide = noop, resize = noop } = opts.pageLifetimes;
      opts.methods = Object.assign(opts.methods, {
        [SHOW_HANDLER]: show,
        [HIDE_HANDLER]: hide
      });
    }
    hook(opts, 'created', function() {
      JBase.call(this);
    })
    opts.methods = Object.assign({}, opts.methods, JBase.prototype);

    const options = JComponent[INIT](opts);
    Component(options);
  }
}

function addComponentToPage(component: any) {
  // 仿支付宝，对组件提供当前页面实例
  // 经过测试，在attached之后 getCurrentPage 返回的是当前页面
  if (!component.$page) {
    component.$page = getCurrentPage();
  }
  if(component.$page) {
    component.$page[ALL_COMPONENTS] = component.$page[ALL_COMPONENTS] || new WeakSet();
    component.$page[ALL_COMPONENTS].add(component);
  }  
}

JComponent.mixin({
  created() {
    // addComponentToPage(this);
  },
  attached() {
    addComponentToPage(this);
    const currentPage = this.$page;
    if (!currentPage) {
      return;
    }
    if (currentPage[ADD_SHOW_HANDLER] && this[SHOW_HANDLER]) {
      currentPage[ADD_SHOW_HANDLER](this[SHOW_HANDLER].bind(this));
    }
    if (currentPage[ADD_HIDE_HANDLER] && this[HIDE_HANDLER]) {
      currentPage[ADD_HIDE_HANDLER](this[HIDE_HANDLER].bind(this));
    }
  },
  detached() {
    if(this.$page && this.$page[ALL_COMPONENTS]) {
      this.$page[ALL_COMPONENTS].delete(this);
    }
    this.$destory();
  }
});
