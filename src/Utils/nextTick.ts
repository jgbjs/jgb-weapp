const callbacks = [] as any[];
let pending = false;
const p = Promise.resolve();
let timerFunc: any = () => {
  p.then(flushCallbacks);
};
if (typeof wx.nextTick !== 'undefined') {
  timerFunc = () => wx.nextTick(flushCallbacks);
}

function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// tslint:disable-next-line:ban-types
export default function(cb: Function, ctx?: any) {
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        console.warn('[nextTick]', e);
      }
    }
  });

  if (!pending) {
    pending = true;
    timerFunc();
  }
}
