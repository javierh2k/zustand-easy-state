import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import secureLocalStorage from 'react-secure-storage';

import { computed } from './customComputedMiddleware';

export const storePersist = (name, persistStore) => (state) =>
  persistStore
    ? persist(state, {
        name,
        partialize: persistStore,
        getStorage: () => {
          let currentStorage = window.localStorage;

          // eslint-disable-next-line no-undef
          if (process.env.NODE_ENV === 'production') {
            currentStorage = secureLocalStorage;
          }

          const modulesList = ['clone', 'detail', 'edit'];

          return (
            !modulesList.includes(window.location.pathname.split('/')[2]) && {
              setItem: (...args) => currentStorage.setItem(...args),
              removeItem: (...args) => currentStorage.removeItem(...args),
              // eslint-disable-next-line no-negated-condition
              getItem: !window.location.href.includes('detail')
                ? (...args) => currentStorage.getItem(...args)
                : async (...args) =>
                    new Promise((resolve) => {
                      if (typeof window === 'undefined') {
                        resolve(null);
                      } else {
                        setTimeout(() => {
                          resolve(currentStorage.getItem(...args));
                        }, 0);
                      }
                    }),
            }
          );
        },
      })
    : state;

export const storeDevTools = (name, env) => (state) =>
  // eslint-disable-next-line no-undef
  env === 'development' ? devtools(state, { name }) : state;

export const storeSubscribe = (state) => subscribeWithSelector(state);

export const storeComputed = (name, computeState) => (state) =>
  computeState ? computed(state, computeState, name) : state;


