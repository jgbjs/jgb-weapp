import isFunction = require('lodash/isFunction');
import { IPlugin } from '../../types/plugins';

const resolveTasks = Symbol('resolveTask');
const observeSymbol = Symbol('observeSymbol');

const componentLazyLoadPlugin: IPlugin = {
  install(res) {
    const { JComponent } = res;
    // add loading property
    // follow chrome: https://mp.weixin.qq.com/s/JlLfJVPnzxLU90aUevenUg
    JComponent.mixin({
      properties: {
        /**
         * j-loading
         * 控制是否延迟初始化
         * value:
         *  lazy：对资源进行延迟加载。
         *  eager：立即加载资源。
         *  auto：浏览器自行判断决定是否延迟加载资源。
         */
        jLoading: {
          type: String,
          value: 'eager' // lazy, eager, auto
        },
        /**
         * j-selector
         * 组件内的某个class
         */
        jSelector: {
          type: String,
          value: '.jgb-lazy-component'
        },
        /**
         * j-threshold
         * 灵敏度。
         * @default 0
         * 默认为 0 表示当图片出现在显示区域中的立即加载显示；
         * 设为整数表示图片距离 x 像素进入显示区域时进行加载；设为负数表示图片进入显示区域 x 像素时进行加载。
         */
        jThreshold: {
          type: Number,
          value: 0
        }
      },
      created() {
        this[resolveTasks] = [];
      },
      detached() {
        if (this[observeSymbol]) {
          this[observeSymbol].disconnect();
        }
      }
    });

    const interceptKeys = ['attached', 'ready'];

    JComponent.intercept(opts => {
      const containsLifetimes = !!opts.lifetimes;
      for (const key of interceptKeys) {
        const oldFun = opts[key];
        opts[key] = async function(...args: any[]) {
          await lazyInitComponent.call(this, key);
          if (isFunction(oldFun)) {
            oldFun.call(this, args);
          }
        };
        if (containsLifetimes && opts.lifetimes[key]) {
          const lifefun = opts.lifetimes[key];
          opts.lifetimes[key] = async function(...args: any[]) {
            await lazyInitComponent.call(this, key);
            if (isFunction(lifefun)) {
              lifefun.call(this, args);
            }
          };
        }
      }
      return opts;
    });
  }
};

async function lazyInitComponent(lifycycle: string) {
  const {
    jLoading: $loading,
    jSelector: $targetSelector,
    jThreshold
  } = this.properties;
  if (!$loading || $loading === 'eager') {
    return;
  }

  if (!this.createIntersectionObserver) {
    return;
  }

  // ready完才能 createIntersectionObserver
  if (lifycycle === 'ready') {
    const observer = this.createIntersectionObserver({
      thresholds: [0, 1]
    });

    this[observeSymbol] = observer;

    observer
      .relativeToViewport({
        bottom: jThreshold,
        top: jThreshold,
        left: jThreshold,
        right: jThreshold
      })
      .observe($targetSelector, () => {
        observer.disconnect();
        this[observeSymbol] = null;
        this[resolveTasks].forEach((task: any) => {
          task();
        });
      });
  }

  return new Promise(resolve => {
    this[resolveTasks].push(resolve);
  });
}

export { componentLazyLoadPlugin };

