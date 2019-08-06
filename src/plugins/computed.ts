import { IPlugin } from '../../types/plugins';
import { Compute } from '../compute';

const computedPlugin: IPlugin = {
  install(res) {
    const { JPage, JComponent } = res;
    // tslint:disable-next-line: only-arrow-functions
    JPage.intercept(function(opts) {
      const init = Compute(opts);
      // tslint:disable-next-line: no-empty
      const onLoad = opts.onLoad || (() => {});
      opts.onLoad = function(...args: any[]) {
        init(this);
        onLoad.apply(this, args);
      };
      return opts;
    });

    // tslint:disable-next-line: only-arrow-functions
    JComponent.intercept(function(opts) {
      const init = Compute(opts);
      // tslint:disable-next-line: no-empty
      const created = opts.created || (() => {});
      opts.created = function(...args: any[]) {
        init(this);
        created.apply(this, args);
      };
      return opts;
    });
  }
};

export default computedPlugin;
