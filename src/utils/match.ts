import memoize from 'lodash/memoize';
import { stringToPath } from './stringToPath';

/**
 * 匹配 Component.observers字段
 * some.field.**, some.field => true
 * some.field.**, some.field.xxx => true
 * some.field.**, some => true
 * some.field, some.field => true
 * some.field, some => true
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/observer.html
 */
export function match(subkeys: string[], updatekey: string): boolean {
  for (const subkey of subkeys) {
    if (innerMatch(subkey, updatekey)) {
      return true;
    }
  }
  return false;
}

export const innerMatch = memoize(
  (subkey: string, updatekey: string) => {
    const callPath = stringToPath(subkey);
    const updatePath = stringToPath(updatekey);
    let len = callPath.length;
    const containWildcards = callPath.find(s => s === '**');
    if (containWildcards) {
      // only: **
      if (len === 1) {
        return true;
      }

      // like: field.**, remove **
      callPath.pop();
      len--;
    }

    const minLen = Math.min(len, updatePath.length);
    let idx = 0;
    while (idx < minLen) {
      if (callPath[idx] !== updatePath[idx]) {
        return false;
      }
      idx++;
    }
    return true;
  },
  (...args: string[]) => args.join('-')
);
