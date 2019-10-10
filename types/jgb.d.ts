/// <reference types="@tuhu/miniprogram-api-typings" />

import { IEventBus } from './eventbus';
import { JApp } from './JApp';
import { JComponent } from './JComponent';
import { jgb } from './jgb-api';
import { JPage } from './JPage';
import { IUsePlugin } from './plugins';
import { Router } from './router';
import * as utils from './utils';

export { Router, JPage, JComponent, JApp };
export { jgb, utils };

export var bus: IEventBus;

export const EventBus: { new (): IEventBus };

export var use: IUsePlugin;

export const Compute: (opts: any) => (scope: any) => void;
