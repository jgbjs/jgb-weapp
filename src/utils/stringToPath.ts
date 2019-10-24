import memoize from 'lodash/memoize';

const charCodeOfDot = '.'.charCodeAt(0);
const reEscapeChar = /\\(\\)?/g;

const rePropName = RegExp(
  // Match anything that isn't a dot or bracket.
  '[^.[\\]]+' +
    '|' +
    // Or match property names within brackets.
    '\\[(?:' +
    // Match a non-string expression.
    '([^"\'].*)' +
    '|' +
    // Or match strings (supports escaping characters).
    '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
    ')\\]' +
    '|' +
    // Or match "" as the space between consecutive dots or empty brackets.
    '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))',
  'g'
);

export const stringToPath = memoize((str: string) => {
  const result = [] as string[];
  // 是否为.号开头
  if (str.charCodeAt(0) === charCodeOfDot) {
    result.push('');
  }
  /**
   * match：匹配的字符串
   * expression、quote、subString ：分别为rePropName第n个括号匹配的字符串
   * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace
   */
  // @ts-ignore
  str.replace(rePropName, (match, expression, quote, subString) => {
    let key = match;
    if (quote) {
      key = subString.replace(reEscapeChar, '$1');
    } else if (expression) {
      key = expression.trim();
    }
    result.push(key);
  });
  return result;
});
