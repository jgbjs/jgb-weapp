import { expectType } from 'tsd';
import { IEventBus, IEventFunction } from '../types/eventbus';
import { JPage } from '../types/JPage';

expectType<void>(JPage({}));

const d = {
  out: ''
};

const extFunction = {
  getFunc() {}
};

JPage({
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
  bindViewTap() {
    expectType<string>(this.data.motto);
    expectType<string>(this.data.out);
    expectType<string>(this.static.value);
    expectType<() => void>(this.bindViewTap);
    expectType<() => void>(this.getFunc);
    // 计算属性
    expectType<string>(this.data.compute);
  },
  ...extFunction
});

// test extension property
JPage({
  onLoad() {
    expectType<IEventBus['on']>(this.$on);
    expectType<Record<string, any>>(this.$options);
    expectType<(observerKey: string, callback: IEventFunction) => any>(
      this.$watch
    );

    expectType<(fn: IEventFunction, timeout?: number) => any>(this.$setTimeout);
    expectType<(fn: IEventFunction, timeout?: number) => any>(
      this.$setInterval
    );
    expectType<(selector: string, ctx?: any) => Promise<any>>(
      this.$scrollIntoView
    );
    expectType<{
      path: string;
      params: any;
      query: any;
      hash: '';
      fullPath: string;
      name: string;
    }>(this.$route);
  }
});
