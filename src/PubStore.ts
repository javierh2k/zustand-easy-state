/* eslint-disable no-constructor-return */
/* eslint-disable @typescript-eslint/no-implicit-any-catch */
import type {
  StateCreator,
  StoreApi,
  StoreMutatorIdentifier,
 } from 'zustand/vanilla';
 
 
 import { createStore } from 'zustand/vanilla';
 
 
 interface IUnit<
  T extends object = any,
  Mos extends Array<[StoreMutatorIdentifier, unknown]> = [],
 > {
  value: StoreApi<T>;
  pubStore: PubStore;
  fn: StateCreator<T, [], Mos>;
 }
 
 
 /**
  * inspired by npm zustand-pub
  */
 export class PubStore {
  private storeSymbol: symbol;
 
 
  private target: Record<string, IUnit>;
 
 
  private w: any;
 
 
  constructor(symbolKey: string) {
    if (!symbolKey) {
      throw new Error('Missing key of PubStore');
    }
 
 
    try {
      this.w =
        typeof window !== 'undefined' && window.origin === window.top?.origin
          ? window.top
          : window;
    } catch (e) {
      this.w = typeof window !== 'undefined' && window;
    }
 
 
    this.storeSymbol = Symbol.for(symbolKey);
    this.target = this.w ? this.w[this.storeSymbol] : undefined;
 
 
    if (this.target) {
      const keys = Object.keys(this.target);
 
 
      return this.target[keys[0]].pubStore;
    }
  }
 
 
  defineStore<
    T extends object,
    Mos extends Array<[StoreMutatorIdentifier, unknown]> = [],
  >(key: string, fn: StateCreator<T, [], Mos>) {
    if (!key) {
      return createStore(fn);
    }
 
 
    let Store: StoreApi<T>;
 
 
    if (this.target && this.target[key] && this.target[key].value) {
      const oldStore = this.target[key].value;
      const newFnValue = fn(oldStore.setState, oldStore.getState, oldStore);
 
 
      oldStore.setState((state: any) => ({
        ...newFnValue,
        ...state,
      }));
      Store = oldStore;
    } else {
      Store = createStore(fn);
    }
 
 
    if (typeof window !== 'undefined') {
      this.w[this.storeSymbol] = {
        ...(this.w[this.storeSymbol] || {}),
        [key]: {
          value: Store,
          pubStore: this,
          fn,
        },
      };
      this.target = this.w[this.storeSymbol];
    }
 
 
    return Store;
  }
 
 
  getStore<T extends object>(key: string): StoreApi<T> {
    const res = this.target && this.target[key] && this.target[key].value;
 
 
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return res || this.defineStore<T>(key, () => ({} as T));
  }
 }
 
 
 export default PubStore;