import { expectType } from 'tsd';
import { IEventBus, IEventFunction, INewEventBus } from '../types/eventbus';
import { JComponent } from '../types/JComponent';

const d = {
  out: ''
};

const extFunction = {
  getFunc() {}
};

JComponent({
  data: {
    motto: '点击 “编译” 以构建',
    userInfo: {},
    hasUserInfo: false,
    ...d
  },
  static: {
    value: ''
  },
  computed: {
    compute(): string {
      expectType<string>(this.data.motto);
      return this.data.motto;
    }
  },
  methods: {
    bindViewTap() {
      expectType<string>(this.data.motto);
      expectType<string>(this.data.out);
      expectType<any>(this.static.value);
      expectType<() => void>(this.bindViewTap);
      expectType<() => void>(this.getFunc);
      // 计算属性
      expectType<string>(this.data.compute);
    },
    ...extFunction
  }
});

// test extension property
JComponent({
  ready() {
    expectType<IEventBus['on']>(this.$on);

    // expectType<Record<string, any>>(this.$page);
    expectType<(observerKey: string, callback: IEventFunction) => any>(
      this.$watch
    );

    expectType<(fn: IEventFunction, timeout?: number) => any>(this.$setTimeout);
    expectType<(fn: IEventFunction, timeout?: number) => any>(
      this.$setInterval
    );

    expectType<(ids: number | number[], busInstance?: INewEventBus) => any>(
      this.$addBusId
    );
  }
});
