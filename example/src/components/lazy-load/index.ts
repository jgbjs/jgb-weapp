import { JComponent } from 'jgb-weapp';

JComponent({
  data: {
    msg: 'not inited'
  },
  watch: {
    msg(msg: string) {
      console.log('component watch', msg);
    }
  },
  attached() {
    this.$setInterval(() => {
      this.setData({
        msg: this.data.msg + '0'
      });
      console.log(`component setInterval`, this.data.msg);
    }, 1000);
    this.setData({
      msg: 'inited'
    });
  }
});
