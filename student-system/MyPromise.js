class MyPromise {
  constructor(executor) {
    this.state = "PENDING";
    this.value = undefined;
    this.reason = undefined;

    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state !== "PENDING") {
        return;
      }

      this.state = "FULFILLED";
      this.value = value;

      this.onFulfilledCallbacks.forEach(callback => {
        setTimeout(() => callback(value), 0);
      });
    };

    const reject = (reason) => {
      if (this.state !== "PENDING") {
        return;
      }

      this.state = "REJECTED";
      this.reason = reason;

      this.onRejectedCallbacks.forEach(callback => {
        setTimeout(() => callback(reason), 0);
      });
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    if (this.state === "FULFILLED") {
      setTimeout(() => {
        if (onFulfilled) {
          onFulfilled(this.value);
        }
      }, 0);
    }

    else if (this.state === "REJECTED") {
      setTimeout(() => {
        if (onRejected) {
          onRejected(this.reason);
        }
      }, 0);
    }

    else {
      this.onFulfilledCallbacks.push(onFulfilled);
      this.onRejectedCallbacks.push(onRejected);
    }

    return this;
  }
}


const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("MyPromise resolved successfully!");
  }, 1000);
});

promise.then(value => {
  console.log(value);
});