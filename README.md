# weapp

对小程序内置对象封装方便扩展

## 文档

[文档](https://jgbjs.github.io/jgb-weapp/)

## 快速开始

安装 weapp

```shell
npm i -S weapp
npm i -g jgb-cli #参考jgb-cli文档

# 开始编译
jgb build
```

使用

```js
// app.js
import { JApp } from 'weapp';
import 'init.js';
JApp({});

// pages/index/index.js
import { JPage } from 'weapp';

JPage({});

// components/index/index.js
import { JComponent } from 'weapp';
JComponent({});

// init.js
import { JApp, JPage, JComponent } from 'weapp';

JPage.mixin({
  onLoad() {
    // 可以做些初始化统计
  }
});
```
