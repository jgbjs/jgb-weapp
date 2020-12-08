require('./polyfill/index');
import JComponent from '../src/JComponent';
import { systemInfo, isSupportVersion } from '../src/utils';

// @ts-ignore
global.Component = function(opts = {} as any) {
  class Component {
    data: Record<string, any>;
    properties: Record<string, any>;
    constructor(opts = {} as any) {
      const { data, properties } = opts;
      this.data = data;
      this.properties = {};
    }
  }
  if (opts.methods) {
    Object.keys(opts.methods).forEach((key) => {
      Component.prototype[key] = opts.methods[key];
    });
  }
  const ctx = new Component(opts);
  let { created, attached, ready } = opts;
  if (isSupportVersion('2.2.3') && opts.lifetimes) {
    const lifetimes = opts.lifetimes;
    if (lifetimes.created) created = lifetimes.created;
    if (lifetimes.attached) attached = lifetimes.attached;
    if (lifetimes.ready) ready = lifetimes.ready;
  }
  call(ctx, created);
  call(ctx, attached);
  call(ctx, ready);
};

// @ts-ignore
global.getCurrentPages = function() {
  return [];
};

describe('JComponent', () => {
  it('extends JBase has $on', () => {
    const created = jest.fn();
    new JComponent({
      created() {
        expect(typeof this.$on).toBe('function');
        created();
      },
    });
    expect(created).toHaveBeenCalled();
  });

  it('test eventbus', () => {
    const on = jest.fn();
    new JComponent({
      created() {
        this.$on('on', on);
        this.emit();
      },
      methods: {
        emit() {
          this.$emit('on');
        },
      },
    });
    expect(on).toHaveBeenCalled();
  });

  it('has method', () => {
    const call = jest.fn();
    new JComponent({
      created() {
        this.call();
      },
      methods: {
        call() {
          call();
        },
      },
    });
    expect(call).toHaveBeenCalled();
  });

  it('mixin', () => {
    const call = jest.fn();
    const created = jest.fn();
    JComponent.mixin({
      created() {
        created();
        this.call();
        expect(typeof this.$on).toBe('function');
      },
      methods: {
        call() {
          expect(typeof this.$on).toBe('function');
          call();
        },
      },
    });
    new JComponent({});

    expect(call).toHaveBeenCalled();
    expect(created).toHaveBeenCalled();
  });

  it('intercept create', () => {
    const call = jest.fn();
    JComponent.intercept('created', () => {
      return 1;
    });
    new JComponent({
      created(interceptOpts) {
        call();
        expect(interceptOpts).toBe(1);
      },
    });
    expect(call).toHaveBeenCalled();
  });

  it('intercept getValue', () => {
    JComponent.intercept('getValue', (value) => {
      return 1 + value;
    });
    new JComponent({
      data: {
        value: 1,
      },
      created() {
        const value = this.getValue(0);
        expect(value).toBe(2);
      },
      methods: {
        getValue(value = 0) {
          return value + this.data.value;
        },
      },
    });
  });

  it('intercept global', () => {
    const call = jest.fn();
    JComponent.intercept((opts) => {
      const oldAttached = opts.attached;
      opts.attached = function() {
        call();
        if (typeof oldAttached === 'function') {
          oldAttached.call(this);
        }
      };
      return opts;
    });
    new JComponent({});
    expect(call).toHaveBeenCalled();
  });
});

describe('lifetimes', () => {
  it('< 2.3.0', () => {
    systemInfo.SDKVersion = '2.2.0';
    const created = jest.fn();
    new JComponent({
      created() {
        created();
      },
      lifetimes: {
        created() {
          created();
        },
      },
    });

    expect(created).toHaveBeenCalled();
    expect(created).toHaveBeenCalledTimes(2);
  });

  it('> 2.3.0', () => {
    systemInfo.SDKVersion = '2.10.0';
    const created = jest.fn();
    new JComponent({
      created() {
        created();
      },
      lifetimes: {
        created() {
          created();
        },
      },
    });

    expect(created).toHaveBeenCalled();
    expect(created).toHaveBeenCalledTimes(2);
  });
});

function call(ctx: any, fn: any, opts: any = void 0) {
  if (typeof fn === 'function') {
    fn.call(ctx, opts);
  }
}
