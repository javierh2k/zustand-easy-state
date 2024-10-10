// import { diff } from 'deep-object-diff';

// const mock = { log: () => {}, table: () => {} };
// const logger = process.env.NODE_ENV === 'production' ? mock : console;

export const computed =
  (initialStore, storeComputed, nameStore) => (set, get, api) => {
    const setWithComputed = (update, replace) => {
      set((state) => {
        const updatedProps =
          typeof update === 'function' ? update(state) : update;
        
          const updated = { ...state, ...updatedProps };

        const computedState = storeComputed(updated, get());

        return { ...updated, ...computedState };
      }, replace);
    };

    api.setState = setWithComputed;

    const state = initialStore(setWithComputed, get, api);

    return { ...state, ...storeComputed(state, get()) };
  };
