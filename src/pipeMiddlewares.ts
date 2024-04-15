import { create } from 'zustand';
import { createJSONStorage } from 'zustand/middleware'

import {
  storePersist,
  storeDevTools,
  storeComputed,
  storeSubscribe,
} from './middlewares';
import { pipe } from './pipe';
// storeSubscribe

export const pipeMiddlewares = ({ nameStore, env, persist, computeState }) =>
  {
    return pipe(
      // log,
      storeDevTools(nameStore, env),
      storePersist(nameStore, persist?.state, persist.storage ?? createJSONStorage(() => localStorage)),
      storeComputed(nameStore, computeState),
      storeSubscribe,
      create,
    );
  }
