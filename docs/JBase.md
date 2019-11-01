# JBase

`JApp` 、`JPage`、 `JComponent`的基类

## 扩展属性

### \$on

事件监听
`\$on(evtName: string, fn: IEventFunction)`

```ts
import { JPage } from 'jgb-weapp';

JPage({
  onLoad() {
    this.$on('load', data => {});
  }
});
```

### \$once

事件监听,只触发一次
`\$once(evtName: string, fn: IEventFunction)`

```ts
import { JPage } from 'jgb-weapp';

JPage({
  onLoad() {
    this.$once('load', data => {});
  }
});
```

### \$emit

事件触发
`\$emit(evtName: string, ...data: any[])`

```ts
import { JPage } from 'jgb-weapp';

JPage({
  onLoad(options) {
    this.$emit('load', {
      options
    });
  }
});
```

### \$emitAsync

异步事件触发，可以等待
`\$emitAsync(evtName: string, ...data: any[])`

```ts
import { JPage } from 'jgb-weapp';

JPage({
  async onLoad(options) {
    await this.$emitAsync('load', {
      options
    });
    console.log('触发完成');
  }
});
```

### \$off

解除事件绑定

```ts
import { JPage } from 'jgb-weapp';

JPage({
  onLoad() {
    this.$on('load', data => {});
  },
  unLoad() {
    this.$off('load');
  }
});
```

### \$addBusId

`1.6.3` 起

向 `Page` 或者 `Component` 添加 `eventBusId`, 在销毁时自动 `off`。防止在内存泄漏等问题。
或者考虑使用 `this.$on` 会自动销毁。

**注意如果不传 `busInstance` 默认是全局的 `bus`**

```ts
import { JPage, bus, EventBus } from 'jgb-weapp';

const newBus = new EventBus();

JPage({
  onLoad() {
    const busId = bus.on('someChange');
    // default
    this.$addBusId(busId);
    // or while auto destory when Page destoryed
    this.$on('someChange');

    const id = newBus.on('someChange');
    this.$addBusId(id, newBus);
  }
});
```

### \$destory

清除所有当前绑定的事件，在`页面`或者`组件`销毁时会自动调用。

### \$setTimeout

`v1.6.0`起

`setTimeout`定时器, 在`页面`或者`组件`销毁时清空。

```ts
JPage({
  onTap() {
    this.$setTimeout(() => {
      console.log(this.data);
    }, 300);
  }
});
```

### \$setInterval

`v1.6.0`起

`setInterval`定时器, 在`页面`或者`组件`销毁时清空。

```ts
JComponent({
  methods: {
    onTap() {
      this.$setInterval(() => {
        console.log(this.data);
      }, 500);
    }
  }
});
```
