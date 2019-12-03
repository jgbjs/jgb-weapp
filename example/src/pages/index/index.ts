import { JPage } from 'jgb-weapp';

JPage({
  data: {
    index: 0
  },
  computed: {
    add(): number {
      return this.data.index + 1;
    }
  },
  watch: {
    ['index'](idx: any) {
      console.log('watch', idx);
    }
  },
  onLoad() {
    console.log(this.data.add);
    this.$setInterval(() => {
      this.setData({
        index: this.data.index + 1
      });
      console.log(`page setInterval`, this.data.index);
    }, 1000);
    this.testBatchSetData();
  },
  testBatchSetData() {
    const idx = this.data.index;
    for (let i = 0; i < 10; i++) {
      this.setData({
        index: idx + i
      });
    }
  }
});
