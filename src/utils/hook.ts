import isFunction = require('lodash/isFunction');
import { IEventFunction } from '../../types/eventbus';

/**
 * hook function
 */
export function hook(obj: any, key: string, fn: IEventFunction) {
  // tslint:disable-next-line: no-empty
  const oldFn = obj[key] || (() => {});
  if (!isFunction(fn)) {
    throw new Error(`cannot hook [${key}], maybe not a function`);
  }
  obj[key] = function(...args: any[]) {
    try {
      fn.apply(this, args);
    } catch (error) {
      console.error(`[hook] function:${key} error`, error);
    }
    oldFn.apply(this, args);
  };
}
