let data = { price: 5, quantity: 2 };
let target = null;

class Dep {
  constructor() {
    this.subscribers = [];
  }
  depend () {
    if (target && !this.subscribers.includes(target)) {
      this.subscribers.push(target);
    }
  }
  notify () {
    this.subscribers.forEach(sub => sub());
  }
}

function reactiveData (data) {
  Object.keys(data).forEach(key => {
    let intervalValue = data[key];
    let dep = new Dep();
    Object.defineProperty(data, key, {
      configurable: false,
      enumerable: true,
      get () {
        dep.depend();
        return intervalValue;
      },
      set (newVal) {
        intervalValue = newVal;
        dep.notify();
      }
    });
  })
}

function watcher (func) {
  target = func;
  target();
  target = null;
}

reactiveData(data);
watcher(() => {
  data.total = data.price * data.quantity;
});
console.log(data.total);
data.price = 10;
console.log(data.total);