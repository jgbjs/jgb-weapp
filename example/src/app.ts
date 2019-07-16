import { JApp, JComponent, JPage } from 'jgb-weapp';

JPage.mixin({
  onLoad(options) {
    this.$scrollIntoView('#test');
    this.test();
  },
  test() {}
});

JComponent.mixin({
  attached() {
    this.test();
  },
  methods: {
    test() {}
  }
});

JApp.mixin({
  onLaunch() {}
});

JApp({});
