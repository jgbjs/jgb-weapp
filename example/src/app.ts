import { JApp, JComponent, JPage } from 'jgb-weapp';

JPage.mixin({
  onLoad(options) {
    this.$scrollIntoView('#test');
    this.test();
    setTimeout(() => {
      console.log('test $options', this.$options);
    }, 10);
  },
  test() {}
});

JComponent.mixin({
  attached() {
    this.test();
    const test = this.$page.data.dads;
    this.$page.setData({
      test: 'test' + test
    });
  },
  methods: {
    test() {}
  }
});

JApp.mixin({
  data: '',
  acb() {
    console.log(this.data);
  }
});

JApp({
  data: {},
  onLaunch() {
    console.log('test $appOptions', this.$appOptions);
  },
  cust() {
    console.log(this.data);
  }
});
