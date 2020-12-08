import JBase, { createBaseCommon } from './JBase';

const { addMixin, addIntercept, initOptions } = createBaseCommon();

function init(opts: any) {
  App(initOptions(opts, 'onLaunch'));
}

export default class JApp extends JBase {
  static mixin = addMixin;
  static intercept = addIntercept;
  private opts: wxNS.App.Option;

  constructor(opts?: wxNS.App.Option) {
    super();
    if (!(this instanceof JApp)) {
      return new JApp(opts);
    }
    this.opts = opts;
    this.appendProtoMethods();
    init(this.opts);
  }

  appendProtoMethods() {
    Object.assign(
      this.opts,
      Object.getPrototypeOf(Object.getPrototypeOf(this))
    );
  }
}

JApp.mixin({
  onLaunch(options: any) {
    this.$appOptions = options;
  },
  onShow(options: any) {
    this.$appOptions = options;
  },
});
