require('./polyfill/index');
import JComponent from '../src/JComponent';
import { systemInfo, isSupportVersion } from '../src/utils';



// @ts-ignore
global.Component = function (opts = {} as any) {
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
    Object.keys(opts.methods).forEach(key => {
      Component.prototype[key] = opts.methods[key];
    });
  }
  const ctx = new Component(opts);
  let { created, attached, ready } = opts;
  if (isSupportVersion('2.2.3') && opts.lifetimes) {
    const lifetimes = opts.lifetimes;
    if(lifetimes.created) created = lifetimes.created;
    if(lifetimes.attached) attached = lifetimes.attached;
    if(lifetimes.ready) ready = lifetimes.ready;

  }
  call(ctx, created);
  call(ctx, attached);
  call(ctx, ready);
}

// @ts-ignore
global.getCurrentPages = function () {
  return []
}

describe('extends JBase', () => {
  it('has $on', () => {
    const created = jest.fn()
    new JComponent({
      created() {
        expect(typeof this.$on).toBe('function')
        created();
      }
    });
    expect(created).toHaveBeenCalled();
  })
});

describe("lifetimes", () => {
  it('< 2.3.0', () => {
    systemInfo.SDKVersion = '2.2.0';
    const created = jest.fn()
    new JComponent({
      created() {
        created()
      },
      lifetimes: {
        created() {
          created();
        }
      }
    });

    expect(created).toHaveBeenCalled();
    expect(created).toHaveBeenCalledTimes(2);
  });

  it('> 2.3.0', () => {
    systemInfo.SDKVersion = '2.10.0';
    const created = jest.fn()
    new JComponent({
      created() {
        created()
      },
      lifetimes: {
        created() {
          created();
        }
      }
    });

    expect(created).toHaveBeenCalled();
    expect(created).toHaveBeenCalledTimes(2);
  });
})

function call(ctx: any, fn: any, opts: any = void 0) {
  if (typeof fn === 'function') {
    fn.call(ctx, opts);
  }
}