# jgb

基于`wx`扩展。

## 异步方法 Promise 化

由于内部维护异步 api 列表，由于微信更新，可能导致没有扩展到该 api。

### example

```ts
import { jgb } from 'jgb-weapp';

jgb
  .request({
    url: 'https://xxx'
  })
  .then(result => {});
```

### request

扩展了`wx.request`的一些功能

- 最大请求数 10

- priority

请求优先级，默认 1，数值最大优先级越小。

```ts
jgb.request({
  priority: 10
});
```

## 拦截

`jgb.intercept(api: string, lifecycle: string, callback: Function)`

- api

拦截的方法名。e.g `request`

- lifecycle

  拦截函数的生命周期，主要是针对异步 api。

  - `begin` 执行开始
  - `success` 执行成功
  - `fail` 执行失败
  - `complete` 执行完成

- callback

  回调函数 `callback: (result, status, options) => any`

  - `result` 返回值，当`status == 'begin'`时为`options`
  - `status` 当前生命周期
  - `options` 参数

```ts
// 拦截请求
jgb.intercept('request', 'begin', options => {
  options.header = Object.assign(options.header, {
    auth: 'xxxx'
  });
  return options;
});

// 拦截返回数据
jgb.intercept('request', 'success', result => {
  const data = result.data;
  return data;
});

jgb.request({
  url: 'https://xxx'
});
```
