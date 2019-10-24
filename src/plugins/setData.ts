import set from 'lodash/set';
import { IPlugin } from '../../types/plugins';
import nextTick from '../utils/nextTick';

/**
 * 优化setData性能
 * 将同一时间片内的setData合并，类似 vue
 */
const setDataPlugin: IPlugin = {
  install(res) {
    const { JComponent, JPage } = res;

    // JComponent 测试下来可能会导致负优化
    // JComponent.mixin({
    //   created() {
    //     setDataPerformance.call(this);
    //   }
    // });

    JPage.mixin({
      onLoad() {
        setDataPerformance.call(this);
      }
    });
  }
};

const $MERGE_DATA = Symbol('$merge_data');

function setDataPerformance(this: any) {
  const setData = this.setData.bind(this);
  this[$MERGE_DATA] = [];

  Object.defineProperty(this, 'setData', {
    configurable: true,
    get() {
      return (data: any, cb: any) => {
        this[$MERGE_DATA].push({ data, cb });
        setDataOnPath(this.data, data);
        nextTick(() => {
          if (this[$MERGE_DATA].length === 0) {
            return;
          }
          const copies = copyArrAndClean(this[$MERGE_DATA]);
          const datas = [];
          const cbs = [] as any[];
          const len = copies.length;
          for (let i = 0; i < len; i++) {
            // tslint:disable-next-line: no-shadowed-variable
            const { data, cb } = copies[i];
            datas.push(data);
            if (typeof cb === 'function') {
              cbs.push(cb);
            }
          }

          const d = Object.assign({}, ...datas);
          setData(d, () => {
            const callbacks = copyArrAndClean(cbs);
            const l = callbacks.length;
            let i = 0;
            while (i < l) {
              try {
                callbacks[i]();
              } catch (error) {
                console.error(error);
              }
              i++;
            }
          });
        });
      };
    }
  });
}

function copyArrAndClean(arr: any[]) {
  const copies = arr.slice(0);
  arr.length = 0;
  return copies;
}

function setDataOnPath(ctx: any, data: any = {}) {
  for (const path of Object.keys(data)) {
    const value = data[path];
    set(ctx, path, value);
  }
}

export default setDataPlugin;
