export {};

declare global {
  interface Array<T> {
    removeByIndex(index: number): Array<T>;
    modifyByIndex(index: number, value: T): Array<T>;
  }
}

if (!Array.prototype.removeByIndex) {
  Array.prototype.removeByIndex = function <T>(this: T[], index: number): T[] {
    return this.slice(0, index).concat(this.slice(index + 1));
  };
}

if (!Array.prototype.modifyByIndex) {
  Array.prototype.modifyByIndex = function <T>(this: T[], index: number, value: T): T[] {
    return this.slice(0, index).concat(value, this.slice(index + 1));
  };
}
