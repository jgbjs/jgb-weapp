import defaultsDeep = require('lodash/defaultsDeep');
import isFunction = require('lodash/isFunction');
import isObject = require('lodash/isObject');
import { IEventFunction } from '../../types/eventbus';
import { hook } from './hook';

export { hook };

// tslint:disable-next-line:ban-types
export function promisify<T extends Function>(wxMethod: T) {
  return (params: any) =>
    new Promise((resolve, reject) => {
      params.success = resolve;
      params.fail = reject;
      wxMethod(params);
    });
}

export function Mixin(base: any, mixins: Set<any>) {
  for (const mixObj of mixins) {
    const keys = [];
    // tslint:disable-next-line:variable-name
    let _mixObj = mixObj;
    while (_mixObj !== null && _mixObj !== Object.prototype) {
      keys.push(...Object.getOwnPropertyNames(_mixObj));
      _mixObj = Object.getPrototypeOf(_mixObj) || _mixObj.__proto__;
    }
    for (const key of keys) {
      const baseValue = base[key];
      const value = mixObj[key];
      if (typeof baseValue === 'undefined') {
        base[key] = value;
      } else if (isFunction(value) && isFunction(baseValue)) {
        hook(base, key, value);
      } else if (isObject(baseValue) && isObject(value)) {
        defaultsDeep(baseValue, value);
      } else if (Array.isArray(baseValue) && Array.isArray(value)) {
        baseValue.push(...value);
      }
    }
  }

  return base;
}

// tslint:disable-next-line:no-empty
export const noop = () => {};

export const systemInfo = wx.getSystemInfoSync() as any;

function indexOrEnd(str: string, q: string) {
  return str.indexOf(q) === -1 ? str.length : str.indexOf(q);
}
function split(v: string) {
  const c = v.replace(/^v/, '').replace(/\+.*$/, '');
  const patchIndex = indexOrEnd(c, '-');
  const arr = c.substring(0, patchIndex).split('.');
  arr.push(c.substring(patchIndex + 1));
  return arr;
}
/**
 * 比较版本
 * v1 === v2 return 0
 * v1 > v2 return 1
 * v1 < v2 return -1
 * @returns
 */
export function compareVersion(v1: string, v2: string) {
  const s1 = split(v1);
  const s2 = split(v2);

  for (let i = 0; i < Math.max(s1.length - 1, s2.length - 1); i++) {
    const n1 = parseInt(s1[i] || '0', 10);
    const n2 = parseInt(s2[i] || '0', 10);

    if (n1 > n2) {
      return 1;
    }
    if (n2 > n1) {
      return -1;
    }
  }
  return 0;
}

export function isSupportVersion(version: string) {
  return compareVersion(systemInfo.SDKVersion, version) >= 0;
}

export function Intercept(
  base: any,
  intercepts: Map<string, IEventFunction[]>
) {
  for (const [key, values] of intercepts) {
    let baseValue: IEventFunction = base[key];
    if (!isFunction(baseValue)) {
      continue;
    }
    Object.defineProperty(base, key, {
      set(nvalue) {
        baseValue = nvalue;
      },
      get() {
        return async (...data: any[]) => {
          const fns = values.concat(baseValue);
          let prevValue: any = data;
          for (const fn of fns) {
            prevValue = await fn.apply(this, prevValue);
          }
          return prevValue;

          // return fns.reduce((prevValue, fn) => {
          //   return fn.apply(this, prevValue);
          // }, data);
        };
      }
    });
  }
  return base;
}

export function getCurrentPage() {
  const pages = getCurrentPages();
  const currentPage: any = pages.length > 0 ? pages[pages.length - 1] : null;
  return currentPage;
}

/**
 * 判断属性是否可以重新定义
 */
export function canPropertyConfigurable(obj: any, key: string) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, key);
  if (!descriptor || descriptor.configurable) {
    return true;
  }
  return false;
}
