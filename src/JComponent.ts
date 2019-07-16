import { IEventFunction } from '../types/eventbus';
import JBase, { event } from './JBase';
import { ADD_HIDE_HANDLER, ADD_SHOW_HANDLER, HIDE_HANDLER, SHOW_HANDLER } from './JPage';
import { getCurrentPage, isSupportVersion, noop } from './utils';
import expand, { INIT } from './utils/expand';

// @ts-ignore
@expand('created')
export default class JComponent {
  static mixin: (obj: any) => void;
  static intercept: (event: string, fn: IEventFunction) => void;
  static [INIT]: (...data: any[]) => any;
  constructor(opts?: any) {
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
    opts.methods = Object.assign({}, opts.methods, JBase.prototype);

    const options = JComponent[INIT](opts);
    Component(options);
  }
}

JComponent.mixin({
  created() {
    this[event] = [];
    // 仿支付宝，对组件提供当前页面实例
    if (!this.$page) {
      this.$page = getCurrentPage();
    }
  },
  attached() {
    const currentPage = getCurrentPage();
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
    this.$destory();
  }
});
