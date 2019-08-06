# JComponent

继承[JBase](JBase.html)

## 使用

```js
// component/index.ts
import { JComponent } from 'jgb-weapp';

JComponent({});
```

## 扩展功能

### mixin

与 `vue` 类似的 `mixin`。执行顺序 `mixin` 优先。

```js
// app.ts
import { JComponent } from 'jgb-weapp';

JComponent.mixin({
  created() {
    // todo
  },
  method: {
    privateFunc() {}
  }
});
```

### intercept

使用参考[JPage](JPage.html#intercept)

### computed

计算属性

```ts
// component/index.ts
import { JComponent } from 'jgb-weapp';

JComponent({
  data: {
    a: 1
  },
  computed: {
    aplus(): any {
      return this.data.a + 1;
    }
  },
  ready() {
    console.log(this.data.a, this.data.aplus);
  }
});
```

## 扩展属性

### \$page

组件所属页面的实例，通过`getCurrentPages()`实现。
