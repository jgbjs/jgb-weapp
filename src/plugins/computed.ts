import { IPlugin } from '../../types/plugins';
import { Compute } from '../compute';

const computedPlugin: IPlugin = {
  install(res) {
    const { JPage, JComponent } = res;
    JPage.intercept(opts => {
      const init = Compute(opts);
      const onLoad = opts.onLoad || noop;
      opts.onLoad = function(...args: any[]) {
        init(this);
        onLoad.apply(this, args);
      };
      return opts;
    });

    JComponent.intercept(opts => {
      const init = Compute(opts);
      const created = opts.created || noop;
      opts.created = function(...args: any[]) {
        init(this);
        created.apply(this, args);
      };
      return opts;
    });
  }
};

// tslint:disable-next-line: no-empty
function noop() {}

export default computedPlugin;
