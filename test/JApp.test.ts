require('./polyfill/index');
import JApp from '../src/JApp';

// @ts-ignore
global.App = function(opts = {} as any) {
  let { onLaunch, onShow, onReady } = opts;
  call(opts, onLaunch, { test: 1 });
  call(opts, onShow);
  call(opts, onReady);
};

function call(ctx: any, fn: any, opts: any = void 0) {
  if (typeof fn === 'function') {
    fn.call(ctx, opts);
  }
}

describe('JApp', () => {
  it('extends JBase has $on', () => {
    const call = jest.fn();
    new JApp({
      onLaunch() {
        expect(typeof this.$on).toBe('function');
        call();
      },
    });
    expect(call).toHaveBeenCalled();
  });

  it('test eventbus', () => {
    const on = jest.fn();
    new JApp({
      onLaunch() {
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
    new JApp({
      onLaunch() {
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
    JApp.mixin({
      onLaunch() {
        created();
        this.call();
        expect(typeof this.$on).toBe('function');
      },
      call() {
        expect(typeof this.$on).toBe('function');
        call();
      },
    });
    new JApp({});

    expect(call).toHaveBeenCalled();
    expect(created).toHaveBeenCalled();
  });

  it('intercept create', () => {
    const call = jest.fn();
    JApp.intercept('onLaunch', () => {
      return 1;
    });
    new JApp({
      onLaunch(interceptOpts) {
        call();
        expect(interceptOpts).toBe(1);
      },
    });
    expect(call).toHaveBeenCalled();
  });

  it('intercept getValue', () => {
    JApp.intercept('getValue', (value) => {
      return 1 + value;
    });
    new JApp({
      data: {
        value: 1,
      },
      onLaunch() {
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
    JApp.intercept((opts) => {
      const oldonReady = opts.onReady;
      opts.onReady = function() {
        call();
        if (typeof oldonReady === 'function') {
          oldonReady.call(this);
        }
      };
      return opts;
    });
    new JApp({});
    expect(call).toHaveBeenCalled();
  });
});
