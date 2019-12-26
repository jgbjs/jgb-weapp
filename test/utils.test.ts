require('./polyfill/index');
import { compareVersion } from '../src/utils/index';

it('compareVersion', () => {
  expect(compareVersion('2.0.1', '2.1.0')).toBe(-1);
  expect(compareVersion('2.0.1', '2.10.10')).toBe(-1);
  expect(compareVersion('2.01.0', '2.1.0')).toBe(0);
  expect(compareVersion('2.1.1', '2.1.1')).toBe(0);
  expect(compareVersion('2.10.1', '2.1.0')).toBe(1);
  expect(compareVersion('3.0.1', '2.1.0')).toBe(1);
});
