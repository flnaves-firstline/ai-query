class Counter {
  private _value = 0;

  public get next() {
    return ++this._value;
  }
}

export const counter = new Counter();

class NegativeCounter {
  private _value = 0;

  public get next() {
    return --this._value;
  }
}

export const negativeCounter = new NegativeCounter();
