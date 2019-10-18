import { JComponent } from 'jgb-weapp';

JComponent({
  data: {
    msg: 'not inited'
  },
  attached() {
    this.$setInterval(() => {
      console.log(`component setInterval`, this.data.msg);
    }, 1000);
    this.setData({
      msg: 'inited'
    });
  }
});
