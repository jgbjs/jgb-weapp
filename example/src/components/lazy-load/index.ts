import { JComponent } from 'jgb-weapp';

JComponent({
  data:{
    msg: 'not inited'
  },
  attached() {
    this.setData({
      msg: 'inited'
    })
  }
});
