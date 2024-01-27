import React, { Dispatch, SetStateAction, useContext, useLayoutEffect, useReducer } from 'react';
import { AppKey } from 'react-apiloader';
import ReactDOM from 'react-dom';

type ModifyValue<T> = (value: T) => T;
type ProduceValue<T> = () => T;
type InitType<T> = T | ProduceValue<T>;

type Atom<TState> = {
  key: AppKey;
  init: InitType<TState>;
  get?: ModifyValue<TState>;
  set?: ModifyValue<TState>;
};

let keyCounter = 1;

export const createAtom = <TState>(config: Omit<Atom<TState>, 'key'>): Atom<TState> => ({
  key: keyCounter++,
  ...config,
});

class ValueContainer<TState> {
  private _value: TState;
  private _subscribers: Dispatch<TState>[] = [];

  constructor(private _atom: Atom<TState>) {
    this._value = this.getInitValue();
  }

  private getInitValue = () => {
    return this._atom.init instanceof Function ? this._atom.init() : this._atom.init;
  };

  value = (): Readonly<TState> => {
    return this._atom.get != null ? this._atom.get(this._value) : this._value;
  };

  setValue: Dispatch<SetStateAction<TState>> = (value) => {
    let newValue = value instanceof Function ? value(this._value) : value;
    newValue = this._atom.set != null ? this._atom.set(newValue) : newValue;
    if (this._value !== newValue) {
      this._value = newValue;
      ReactDOM.unstable_batchedUpdates(() => this._subscribers.forEach((callback) => callback(this._value)));
    }
  };

  resetValue = (batchedExternally?: boolean) => {
    let newValue = this.getInitValue();
    newValue = this._atom.set != null ? this._atom.set(newValue) : newValue;
    if (this._value !== newValue) {
      this._value = newValue;
      const update = () => this._subscribers.forEach((callback) => callback(this._value));
      if (batchedExternally) update();
      else ReactDOM.unstable_batchedUpdates(update);
    }
  };

  subscribe = (callback: Dispatch<TState>) => {
    this._subscribers.push(callback);
  };

  unsubscribe = (callback: Dispatch<TState>) => {
    this._subscribers = this._subscribers.filter((x) => x !== callback);
  };
}

export class GlobalState {
  constructor(private _globalState = new Map<AppKey, ValueContainer<unknown>>()) {}

  get = <T>(atom: Atom<T>): ValueContainer<T> => {
    if (!this._globalState.has(atom.key))
      this._globalState.set(atom.key, new ValueContainer<T>(atom) as ValueContainer<unknown>);
    return this._globalState.get(atom.key) as ValueContainer<T>;
  };

  tryGet = <T>(atom: Atom<T>): ValueContainer<T> | undefined =>
    this._globalState.get(atom.key) as ValueContainer<T> | undefined;

  reset = (): void => ReactDOM.unstable_batchedUpdates(() => this._globalState.forEach((v) => v.resetValue(true)));
}

export const GlobalStateContext = React.createContext<GlobalState | undefined>(undefined);

export const useGlobalStateContext = (): GlobalState => {
  const globalState = useContext(GlobalStateContext);
  if (globalState == null) throw new Error('You should add <GlobalStateContext.Provider> as the root component');
  return globalState;
};

export const useAtom = <T>(atom: Atom<T>): [T, Dispatch<SetStateAction<T>>] => {
  const [, forceRender] = useReducer<(val: number) => number>((s) => s + 1, 0);
  const container = useGlobalStateContext().get(atom);
  useLayoutEffect(() => {
    container.subscribe(forceRender);
    return () => container.unsubscribe(forceRender);
  }, [container]);
  return [container.value(), container.setValue];
};

export const useSetAtom = <T>(atom: Atom<T>): Dispatch<SetStateAction<T>> => useGlobalStateContext().get(atom).setValue;

export const useResetAtom = <T>(atom: Atom<T>): (() => void) => useGlobalStateContext().get(atom).resetValue;
