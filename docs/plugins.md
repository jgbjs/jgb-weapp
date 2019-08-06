# 插件

内置插件功能。
其实安装`jgb-cli`正常编译，引用`jgb-weapp`都是同一个实例的话，是没有必要使用插件功能的。
这里的插件功能是在没有引用`jgb-weapp`时，或者当引用`jgb-weapp`的实例不是同一个的情况。

## 使用

```ts
import { use } from 'jgb-weapp';

const plugin = {
  install(opts) {
    const { JApp, JPage, JComponent, jgb } = opts;

    JPage.mixin({
      // todo
    });
  }
};

use(plugin);
```
