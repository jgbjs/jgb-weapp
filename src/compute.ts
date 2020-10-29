import get from 'lodash/get';
import { IEventFunction } from '../types/eventbus';
import { canPropertyConfigurable } from './utils';
import { CallNode, CallTree } from './utils/calltree';
import { match } from './utils/match';

const hasOwnProperty = Object.prototype.hasOwnProperty;
const cache = Symbol(`cache`);
const setData = Symbol(`setData`);
const doingSetData = Symbol(`doingSetData`);
const doingSetProps = Symbol(`doingSetProps`);

/**
 * 计算属性
 */
export function Compute(opts: any) {
  const computed = opts.computed || {};
  const watch = opts.watch || {};
  const data = opts.data || {};
  const properties = opts.properties || {};

  const computedKeys = Object.keys(computed);
  const propertyKeys = Object.keys(properties);

  if (propertyKeys.length) {
    propertyKeys.forEach((key) => {
      if (hasOwnProperty.call(propertyKeys, key)) {
        return;
      }
      const value = properties[key];
      const valueType = Object.prototype.toString.call(value);
      let oldObserver: any;
      if (
        valueType === '[object Function]' ||
        valueType === '[object Null]' ||
        valueType === '[object Array]'
      ) {
        properties[key] = {
          type: value,
        };
      } else if (typeof value === 'object') {
        if (hasOwnProperty.call(value, 'value')) {
          // // 先将 properties 里的字段写入到 data 中
          // Object.defineProperty(data, key, {
          //   get() {
          //     return value.value;
          //   },
          // });
        }

        if (
          hasOwnProperty.call(value, 'observer') &&
          typeof value.observer === 'function'
        ) {
          oldObserver = value.observer;
        }
      }

      // 追加 observer，用于监听变动
      properties[key].observer = function(...args: any[]) {
        // 优先使用原生setData
        const originalSetData = this[setData] || this.setData;

        // 调用 setData 设置 properties
        if (this[doingSetProps]) {
          if (oldObserver) {
            oldObserver.apply(this, args);
          }
          return;
        }

        if (this[doingSetData]) {
          // eslint-disable-next-line no-console
          // console.warn("can't call setData in computed getter function!");
          return;
        }

        this[doingSetData] = true;

        // 计算 computed
        const needUpdate = calcComputed(this, computed, computedKeys);

        if (Object.keys(needUpdate).length > 0) {
          // 做 computed 属性的 setData
          originalSetData.call(this, needUpdate, () =>
            callWatch(this, needUpdate, watch)
          );
        }

        this[doingSetData] = false;

        if (oldObserver) {
          oldObserver.apply(this, args);
        }
      };
    });
  }

  // 计算 computed
  calcComputed(transformInitOpts(opts), computed, computedKeys);

  return function init(scope: any) {
    scope[cache] = {};
    scope[setData] = scope.setData;
    scope[doingSetData] = false;
    scope[doingSetProps] = false;

    Object.defineProperty(scope, '$watch', {
      configurable: true,
      get() {
        return addWatch;
      },
    });

    if (canPropertyConfigurable(scope, 'setData')) {
      Object.defineProperty(scope, 'setData', {
        configurable: true,
        get() {
          return _setData;
        },
      });
    }

    // tslint:disable-next-line: no-shadowed-variable
    function _setData(this: any, data: any, callback: any) {
      const originalSetData = this[setData];

      if (this[doingSetData]) {
        // eslint-disable-next-line no-console
        // console.warn("can't call setData in computed getter function!");
        return;
      }

      this[doingSetData] = true;

      const dataKeys = Object.keys(data);
      for (let i = 0, len = dataKeys.length; i < len; i++) {
        const key = dataKeys[i];

        if (typeof computed[key] !== 'undefined') {
          delete data[key];
        }
        if (!this[doingSetProps] && propertyKeys.indexOf(key) >= 0) {
          this[doingSetProps] = true;
        }
      }

      // 做 data 属性的 setData
      originalSetData.call(this, data, () => {
        callWatch(this, data, watch);
        if (typeof callback === 'function') {
          callback.call(this);
        }
      });

      const computeStart = Date.now();
      // 计算 computed
      const needUpdate = calcComputed(this, computed, computedKeys);
      const computeCostTime = Date.now() - computeStart;
      if (computeCostTime > 20)
        console.warn(
          'jgb计算属性耗时过高,检测是否有耗时计算，建议优化。',
          computeCostTime
        );

      if (Object.keys(needUpdate).length > 0) {
        // 做 computed 属性的 setData
        originalSetData.call(this, needUpdate);
      }

      this[doingSetData] = false;
      this[doingSetProps] = false;
    }
  };

  function addWatch(key: string, fn: IEventFunction) {
    if (watch[key]) {
      console.warn(`Watch中已经存在 ${key}, 原有将被覆盖`);
    }

    watch[key] = fn;
  }
}

/**
 * 通知 watch改变
 */
export function callWatch(scope: any, updateData: any = {}, watch: any = {}) {
  const watchKeys = Object.keys(watch);
  const updateKeys = Object.keys(updateData);

  for (const watchkey of watchKeys) {
    // 可能有这种情况： number1, number2
    const subkeys = watchkey.split(',').map((key) => `${key}`.trim());
    for (const updatekey of updateKeys) {
      // 一次 setData 最多触发每个监听器一次
      if (match(subkeys, updatekey)) {
        const fn = watch[watchkey];
        fn.apply(
          scope,
          subkeys.map((key) => {
            const getPath = key.replace(/\.*\*{2}/, '');
            if (getPath === '') {
              return scope.data;
            }
            return get(scope.data, getPath);
          })
        );
        break;
      }
    }
  }
}

/**
 * 转换初始化的 properties
 */
function transformInitOpts(opts: any) {
  opts = Object.assign({}, opts);
  const propertyKeys = Object.keys(opts.properties || {});
  const data = opts.data || {};
  const newProps = {} as any;

  propertyKeys.forEach((key) => {
    const value = data[key];
    // if(typeof value === 'undefined') {
    // }
    newProps[key] = value;
  });

  opts.properties = newProps;
  return opts;
}

function setPropertyValue(obj: any, key: string, value: any) {
  Object.defineProperty(obj, key, {
    configurable: true,
    get() {
      return value;
    },
    set(val) {
      value = val;
    },
  });
}

export function calcComputed(scope: any, computed: any, keys: any[]) {
  const computedKeys = [].concat(keys);
  if (computedKeys.length === 0) {
    return {};
  }
  const needUpdate: any = {};
  const callTree = new CallTree();

  // 修复当没有this.data时会报错
  if (!scope.data) {
    scope.data = {};
  }

  const computedCache = scope[cache] || scope.data || {};

  const getAndSetCache = (key: string, getter: any) => {
    if (typeof getter !== 'function') {
      return;
    }
    const value = getter.call(scope);
    if (computedCache[key] !== value) {
      needUpdate[key] = value;
      computedCache[key] = value;

      // 修复computed的属性引用computed的属性 计算值时获取不到实时数据
      setPropertyValue(scope.data, key, value);
    }
  };

  for (let i = 0, len = computedKeys.length; i < len; i++) {
    const key = computedKeys[i];
    const getter = computed[key];
    if (typeof getter === 'function') {
      const depkeys = getDepKeys(getter, computed, scope);
      const callNode = new CallNode(key, [...depkeys]);
      callTree.addCallNode(callNode);
    }
  }

  const squence = callTree.getBestCallStackSequence();
  squence.forEach((node) => {
    const getter = computed[node.key];
    getAndSetCache(node.key, getter);
  });

  return needUpdate;
}

const cacheContainsComputekey = new WeakMap();

/**
 * 获取computed中依赖的data中key
 * e.g.
 *  this.data.key
 *  this.data['key'] this.data["key"]
 * @param fn
 * @param computed
 */
export function getDepKeys(
  fn: Function,
  computed: any,
  scope?: any
): Set<string> {
  if (cacheContainsComputekey.has(fn)) {
    return cacheContainsComputekey.get(fn);
  }
  const matchComputeKeys = new Set<string>();
  const keys = Object.keys(computed);
  const [isSuccess, depKeys] = tryUseProxyCollectDepKeys(scope, fn);
  if (isSuccess) {
    for (const key of depKeys.values()) {
      if (keys.includes(key)) {
        matchComputeKeys.add(key);
      }
    }
  } else {
    const str: string = fn.toString();

    const reg1 = new RegExp(`data\\.(${keys.join('|')})`, 'g');
    const reg2 = new RegExp(`data\\[('|")(${keys.join('|')})\\1\\]`, 'g');

    let matches;
    // tslint:disable-next-line: no-conditional-assignment
    while ((matches = reg1.exec(str)) !== null) {
      matchComputeKeys.add(matches[1]);
    }

    // tslint:disable-next-line: no-conditional-assignment
    while ((matches = reg2.exec(str)) !== null) {
      matchComputeKeys.add(matches[2]);
    }

    cacheContainsComputekey.set(fn, matchComputeKeys);
  }

  return matchComputeKeys;
}

/**
 * 使用Proxy收集依赖
 */
function tryUseProxyCollectDepKeys(
  scope: any,
  fn: Function
): [boolean, Set<string>] {
  const matchedKeys: Set<string> = new Set();
  if (!scope) return [false, matchedKeys];
  const originData = scope.data || {};
  let isSuccess = true;
  try {
    const proxyData = new Proxy(originData, {
      get(target, prop) {
        if (typeof prop === 'string') matchedKeys.add(prop);
        return target[prop] || scope.properties?.[prop];
      },
    });
    scope.data = proxyData;
    fn.call(scope);
    scope.data = originData;
  } catch (e) {
    isSuccess = false;
  } finally {
    scope.data = originData;
    return [isSuccess, matchedKeys];
  }
}
