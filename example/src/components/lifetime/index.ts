import { JComponent } from 'jgb-weapp';

JComponent({
  lifetimes: {
    created() {
      console.log('lifetimes created', this)
    }
  },
  created() {
    console.log('created', this)
  }
})