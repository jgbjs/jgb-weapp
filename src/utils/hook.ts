import isFunction = require('lodash/isFunction');
import { IEventFunction } from '../../types/eventbus';

/**
 * hook function
 * @param obj 
 * @param key 
 * @param fn 
 * @param hookFirst {Boolean} hook的方法优先执行
 */
export function hook(obj: any, key: string, fn: IEventFunction, hookFirst = true) {
  // tslint:disable-next-line: no-empty
  const oldFn = obj[key] || (() => {});
  if (!isFunction(fn)) {
    throw new Error(`cannot hook [${key}], maybe not a function`);
  }
  obj[key] = function(...args: any[]) {
    !hookFirst && oldFn.apply(this, args);
    try {
      fn.apply(this, args);
    } catch (error) {
      console.error(`[hook] function:${key} error`, error);
    }
    hookFirst && oldFn.apply(this, args);
  };
}
