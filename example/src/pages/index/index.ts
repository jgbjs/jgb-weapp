import { JPage } from 'jgb-weapp';

JPage({
  data: {
    index: 0
  },
  onLoad() {},
  testBatchSetData() {
    const idx = this.data.index;
    for (let i = 0; i < 10; i++) {
      this.setData({
        index: idx + i
      });
    }
  }
});
