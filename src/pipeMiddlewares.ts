import { create } from "zustand";
import { storePersist, storeDevTools, storeComputed, storeSubscribe } from './middlewares.js';
import { pipe } from './pipe.js';

export const pipeMiddlewares = ({ nameStore, persistStore, computeState }) => pipe(
  // log,
  storeDevTools(nameStore),
  storePersist(nameStore, persistStore),
  storeComputed(nameStore, computeState),
  storeSubscribe,
  create
);
