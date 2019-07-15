import JBase from './JBase';
import expand, { INIT } from './utils/expand';
@expand('onLaunch')
export default class JApp extends JBase {
  static [INIT]: (...data: any[]) => any;
  constructor(opts?: any) {
    super();
    if (!(this instanceof JApp)) {
      return new JApp(opts);
    }

    const options = JApp[INIT](opts);
    App(options);
  }
}
