import { JPage, EventBus } from 'jgb-weapp'

const newBus = new EventBus;

JPage({
  onLoad() {
    const ids = newBus.on('testOn', () => {
      // test
    });

    this.$addBusId(ids, newBus)
    console.log(newBus)
  }
})