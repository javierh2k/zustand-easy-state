import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

import { computed } from './customComputedMiddleware';

export const storePersist =
  (name, persistState, persistStorageEngine) => (state) =>
    persistState
      ? persist(state, {
          name,
          partialize: persistState,
          storage: persistStorageEngine,
        })
      : state;

export const storeDevTools =
  (name, env = 'development') =>
  (state) =>
    env === 'development' ? devtools(state, { name }) : state;

export const storeSubscribe = (state) => subscribeWithSelector(state);

export const storeComputed = (name, computeState) => (state) =>
  computeState ? computed(state, computeState, name) : state;
