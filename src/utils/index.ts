import isFunction = require('lodash/isFunction');
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
