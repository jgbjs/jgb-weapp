import isFunction from 'lodash/isFunction';
import { IEventFunction } from '../../types/eventbus';

type Rd = Record<string, any>;

export function createStaticIntercept() {
  /** 拦截单个方法  */
  const intercepts = new Map<string, IEventFunction[]>();
  /** 拦截整个opts  */
  const globalIntercepts = new Set<IEventFunction>();

  return {
    addIntercept(event: string | IEventFunction, ifn?: IEventFunction) {
      if (typeof event === 'string') {
        const fns = intercepts.get(event) || [];
        fns.push(ifn);
        intercepts.set(event, fns);
        return;
      }

      globalIntercepts.add(event);
    },
    /**
     * 拦截整个opts
     * @param opts
     */
    interceptOptions(opts: any, intercepts = globalIntercepts) {
      const fns = [...intercepts];
      if (fns.length === 0) {
        return opts;
      }
      const [options] = callInterceptCall([opts], fns);
      return options;
    },
    getIntercepts() {
      return intercepts;
    },
    getGlobalIntercepts() {
      return globalIntercepts;
    },
  };
}

/**
 * 迭代调用拦截函数
 * @param data
 * @param intercepts
 */
export function callInterceptCall(
  data: any[],
  intercepts: IEventFunction[] = []
) {
  return intercepts.reduce((prevValue, invoke) => {
    const value = invoke.apply(null, prevValue);
    // promise like
    if (typeof value === 'object' && typeof value.then === 'function') {
      throw Error(
        `intercept cannot be async. \n funciton: ${invoke.toString()}`
      );
    }
    return [].concat(value);
  }, data);
}

/**
 * intercept 
 * use Object.defineProperty intercept function
 * @param base
 * @param intercepts
 */
export function doIntercept(
  base: Rd,
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
        return (...data: any[]) => {
          const fns = values.concat(baseValue);
          let prevValue: any = data;

          // 只有一个参数
          if (data.length <= 1) {
            [prevValue] = data;
            for (const fn of fns) {
              prevValue = fn.call(this, prevValue);
            }
            return prevValue;
          }

          // 多个参数
          for (const fn of fns) {
            prevValue = fn.apply(this, [].concat(prevValue));
          }
          return prevValue;
        };
      },
    });
  }
  return base;
}
