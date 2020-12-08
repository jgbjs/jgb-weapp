require('./polyfill/index');
import JPage from '../src/JPage';
import { systemInfo, isSupportVersion } from '../src/utils';

// @ts-ignore
global.Page = function(opts = {} as any) {
  let { onLoad, onShow, onReady } = opts;
  call(opts, onLoad, { test: 1 });
  call(opts, onShow);
  call(opts, onReady);
};

function call(ctx: any, fn: any, opts: any = void 0) {
  if (typeof fn === 'function') {
    fn.call(ctx, opts);
  }
}

describe('JPage', () => {
  it('extends JBase has $on', () => {
    const call = jest.fn();
    new JPage({
      onLoad() {
        expect(typeof this.$on).toBe('function');
        call();
      },
    });
    expect(call).toHaveBeenCalled();
  });

  it('extends JPage has $scrollIntoView', () => {
    const call = jest.fn();
    new JPage({
      onLoad() {
        expect(typeof this.$scrollIntoView).toBe('function');
        call();
      },
    });
    expect(call).toHaveBeenCalled();
  });

  it('test eventbus', () => {
    const on = jest.fn();
    new JPage({
      onLoad() {
        this.$on('on', on);
        this.emit();
      },
      emit() {
        this.$emit('on');
      },
    });
    expect(on).toHaveBeenCalled();
  });

  it('has method', () => {
    const call = jest.fn();
    new JPage({
      onLoad() {
        this.call();
      },
      call() {
        call();
      },
    });
    expect(call).toHaveBeenCalled();
  });

  it('mixin', () => {
    const call = jest.fn();
    const created = jest.fn();
    JPage.mixin({
      onLoad() {
        created();
        this.call();
        expect(typeof this.$on).toBe('function');
      },
      call() {
        expect(typeof this.$on).toBe('function');
        call();
      },
    });
    new JPage({});

    expect(call).toHaveBeenCalled();
    expect(created).toHaveBeenCalled();
  });

  it('intercept create', () => {
    const call = jest.fn();
    JPage.intercept('onLoad', () => {
      return 1;
    });
    new JPage({
      onLoad(interceptOpts) {
        call();
        expect(interceptOpts).toBe(1);
      },
    });
    expect(call).toHaveBeenCalled();
  });

  it('intercept getValue', () => {
    JPage.intercept('getValue', (value) => {
      return 1 + value;
    });
    new JPage({
      data: {
        value: 1,
      },
      onLoad() {
        const value = this.getValue(0);
        expect(value).toBe(2);
      },
      getValue(value = 0) {
        return value + this.data.value;
      },
    });
  });

  it('intercept global', () => {
    const call = jest.fn();
    JPage.intercept((opts) => {
      const oldonReady = opts.onReady;
      opts.onReady = function() {
        call();
        if (typeof oldonReady === 'function') {
          oldonReady.call(this);
        }
      };
      return opts;
    });
    new JPage({});
    expect(call).toHaveBeenCalled();
  });
});
