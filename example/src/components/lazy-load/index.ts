import { JComponent } from 'jgb-weapp';

JComponent({
  data: {
    msg: 'not inited'
  },
  properties: {
    testProp: { type: String, value: 'testProp' }
  },
  computed: {
    test() {
      console.log(`this.properties.testProp`, this.properties.testProp);
      return this.properties.testProp;
    }
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
