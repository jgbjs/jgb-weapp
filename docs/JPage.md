# JPage

继承[JBase](JBase.html)

## 使用

```js
// pages/index.ts
import { JPage } from 'jgb-weapp';

JPage({});
```

## 扩展功能

### mixin

与 `vue` 类似的 `mixin`。执行顺序 `mixin` 优先。

```js
// app.ts
import { JPage } from 'jgb-weapp';
import { pv } from 'xxx-tracker';

JPage.mixin({
  onLoad(options) {
    // 埋点
    pv(options);
  }
});
```

```js
// pages/index.ts
import { JPage } from 'jgb-weapp';

JPage({
  onLoad() {
    // will auto execute pv()
  }
});
```

### intercept

- `intercept(eventname: string, func: (opts:any) => any)`

在`Page.onLoad`时执行拦截 `Page` 的某个方法接受的参数，并返回新值。内部实现时通过, `Object.defineProperty`实现。

```js
import { JPage } from 'jgb-weapp';

JPage.intercept('onShareAppMessage', opts => {
  // opts 为 onShareAppMessage 的options
  if (opts.webViewUrl) {
    // do something
  }
  return opts;
});
```

- `intercept(func: (opts:any) => any)`

提供拦截整个`Page(opts: object)`

```js
import { JPage } from 'jgb-weapp';

JPage.intercept(opts => {
  const oldLoad = opts.onLoad;

  opts.onLoad = () => {
    // todo
  };

  return opts;
});
```

## 扩展属性

### \$scrollIntoView

滚动到页面指定元素

`$scrollIntoView(selector: string, ctx?: any)`

```js
import { JPage } from 'jgb-weapp';

JPage({
  onClick() {
    this.$scrollIntoView('#targetid');
  }
});
```

- \$options

`Page.onLoad`时`options`

- \$appOptions

`getApp().$appOptions`
