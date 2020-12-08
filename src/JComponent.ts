import JBase, { createBaseCommon } from './JBase';
import { getCurrentPage, isSupportVersion, noop } from './utils';
import {
  ADD_HIDE_HANDLER,
  ADD_SHOW_HANDLER,
  ALL_COMPONENTS,
  HIDE_HANDLER,
  SHOW_HANDLER,
} from './utils/const';
import { hook } from './utils/hook';

const lifetimesKey: ['created', 'attached', 'ready', 'moved', 'detached'] = [
  'created',
  'attached',
  'ready',
  'moved',
  'detached',
];

type Rd = Record<string, any>;

const { addMixin, addIntercept, initOptions } = createBaseCommon();

function init(opts: any) {
  Component(initOptions(opts, 'created'));
}

export default class JComponent extends JBase {
  static mixin = addMixin;
  static intercept = addIntercept;
  opts?: wxNS.Component.Options<Rd, Rd, Rd>;

  constructor(opts?: wxNS.Component.Options<Rd, Rd, Rd>) {
    super();
    if (!(this instanceof JComponent)) {
      return new JComponent(opts);
    }
    this.opts = opts;
    this.compatLifetime();
    this.compatPageLifetime();
    this.appendProtoMethods();

    init(this.opts);
  }

  appendProtoMethods() {
    const methods = Object.assign(
      {},
      Object.getPrototypeOf(Object.getPrototypeOf(this)),
      this.opts.methods
    );
    this.opts.methods = methods;
  }

  compatPageLifetime() {
    const opts = this.opts;
    if (opts.pageLifetimes && !isSupportVersion('2.2.3')) {
      const { show = noop, hide = noop, resize = noop } = opts.pageLifetimes;
      opts.methods = Object.assign(opts.methods, {
        [SHOW_HANDLER]: show,
        [HIDE_HANDLER]: hide,
      });
    }
  }

  compatLifetime() {
    const opts = this.opts;
    if (!opts.lifetimes) {
      return;
    }

    const lifetimes = opts.lifetimes;
    // 对低版本做兼容
    if (!isSupportVersion('2.2.3')) {
      lifetimesKey.forEach((key) => {
        if (lifetimes[key]) {
          hook(opts, key, lifetimes[key]);
        }
      });
      return;
    }
    // 兼容老版本生命周期
    lifetimesKey.forEach((key) => {
      if (lifetimes[key]) {
        hook(
          lifetimes,
          key,
          function(this: JComponent, ...args: any[]) {
            const fn = opts[key];
            if (typeof fn === 'function') {
              fn.apply(this, args);
            }
          },
          false
        );
      }
    });
  }
}

function addComponentToPage(component: any) {
  // 仿支付宝，对组件提供当前页面实例
  // 经过测试，在attached之后 getCurrentPage 返回的是当前页面
  if (!component.$page) {
    component.$page = getCurrentPage();
  }
  if (component.$page) {
    component.$page[ALL_COMPONENTS] =
      component.$page[ALL_COMPONENTS] || new WeakSet();
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
    if (this.$page && this.$page[ALL_COMPONENTS]) {
      this.$page[ALL_COMPONENTS].delete(this);
    }
    this.$destory();
  },
});
