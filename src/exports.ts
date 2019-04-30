import { Compute } from './compute';
import { bus } from './EventBus';
import JApp from './JApp';
import JComponent from './JComponent';
import JPage from './JPage';
import { componentLazyLoadPlugin, ComputedPlugin, NativeApiPlugin, RouterPlugin, SetDataPlugin, use } from './plugins';
import { Router } from './plugins/router';
import { jgb } from './plugins/use';

use(NativeApiPlugin);
use(RouterPlugin);
use(SetDataPlugin);
use(ComputedPlugin);
use(componentLazyLoadPlugin);

export { JPage, JApp, JComponent, Router, bus, jgb, use, Compute };

