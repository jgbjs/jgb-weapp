import isNull from 'lodash/isNull';
import defaultsDeep = require('lodash/defaultsDeep');
import isFunction = require('lodash/isFunction');
import isObject = require('lodash/isObject');
import { hook } from './hook';

type Rd = Record<string | symbol, any>;

export function createStaticMixin() {
  let mixins: any[] = [];

  return {
    addMixin(opts: Rd) {
      if (!isObject(opts)) {
        return;
      }

      mixins.push(opts);
    },
    getMixin() {
      return mixins;
    },
  };
}

/**
 * 扁平Object
 * @example class => flatten object
 * @param base
 */
export function flattenObject(base: Rd) {
  const obj = Object.create(null);
  defaultsDeep(obj, base);

  while (base && base !== Object.prototype) {
    const proto = Object.getPrototypeOf(base);
    defaultsDeep(obj, proto);
    base = proto;
  }

  return obj;
}

export function mergeMixn(base: Rd, mixins: Set<Rd>) {
  base = flattenObject(base);
  for (const mixObj of mixins) {
    const keys = Object.keys(flattenObject(mixObj));
    for (const key of keys) {
      const baseValue = base[key];
      const value = mixObj[key];
      if (typeof baseValue === 'undefined' || isNull(baseValue)) {
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
