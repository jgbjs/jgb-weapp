# JApp

继承[JBase](JBase.html)

## 使用

与原生 `App` 保持一致

```js
// app.ts
import { JApp } from 'jgb-weapp';

JApp({});
```

## 扩展功能

- mixin

与 `vue` 类似的 `mixin`。执行顺序 `mixin` 优先。

```js
import { JApp } from 'jgb-weapp';

JApp.mixin({
  onLaunch(options) {
    // todo somethind
  }
});
```

## 扩展属性

### \$appOptions

`App.onLaunch` 时的`options`，可以在`getApp()`中使用。

```js
import { JPage } from 'jgb-weapp';

JPage({
  onLoad() {
    const app = getApp();
    console.log(app.$appOptions);
  }
});
```
