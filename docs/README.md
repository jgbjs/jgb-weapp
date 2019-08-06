# jgb-weapp

微信小程序渐进增强框架，基于微信小程序原生扩展，语法和原生保持一致。

## 快速上手

- 安装

```sh
yarn add -D jgb-weapp
```

- 使用

```js
// app.js
import { JApp, JPage } from 'jgb-weapp';

// 类似vue的mixin
JPage.mixin({
  onLoad(options) {
    console.log(options);
  }
});

JApp({
  onLaunch() {
    // todo:
  }
});
```

```js
// pages/index.js
import { JPage } from 'jgb-weapp';

// will console.log onLoad
JPage({});
```
