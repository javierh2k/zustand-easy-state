import { create } from "zustand";
import { storePersist, storeDevTools, storeComputed, storeSubscribe } from './middlewares.js';
import { pipe } from './pipe.js';

const storeLogger =(enableLogging)=> (config) => (set, get, api) =>
config(
  (args) => {
    if (enableLogging) {
      const prevState = get();


      console.groupCollapsed(
        `%cZustand Action @ ${new Date().toLocaleTimeString()}`,
        'color: #8B0000; font-weight: bold;',
      );
      console.log(
        '%cprev state',
        'color: #9E9E9E; font-weight: bold;',
        prevState,
      );
      set(args);


      const nextState = get();


      console.log(
        '%cnext state',
        'color: #4CAF50; font-weight: bold;',
        nextState,
      );
      console.groupEnd();
    } else {
      set(args);
    }
  },
  get,
  api,
);

export const pipeMiddlewares = ({ nameStore, persistStore, computeState, reduxDevTool, logger, middlewares }) => pipe(
  // log,
  storeDevTools(nameStore, reduxDevTool),
  storePersist(nameStore, persistStore),
  // storePersist(nameStore, persist?.state, persist.storage ?? createJSONStorage(() => localStorage)),
  storeComputed(nameStore, computeState),
  storeSubscribe,
  storeLogger(logger),
  ...middlewares,
  create
);
