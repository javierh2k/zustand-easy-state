
import { produce } from 'immer';

// import { createContext, useContext, useRef, useEffect } from 'react';
import { createTrackedSelector } from 'react-tracked';
import { pipeMiddlewares } from './pipeMiddlewares';

// import { createStore } from '../../../core/zustand/middlewares';
// import { initialState } from './initialState';
// import { actions } from './actions';
// import { computeState } from './computeState';

function getCallingFunctionName() {
  const error = new Error();
  const stackTrace = String(error.stack).split('\n');
  // console.log('track::::', stackTrace)
  const f = stackTrace.findIndex((line) => line.includes('__awaiter'));
  const functionName = stackTrace[f + 1].trim().split(' ')[1];
  // console.log('functionName:::', functionName)
  ///\s+at\s+(\S+)/.exec(callerLine)[1];
  return functionName;
}


type OptionsStore = { 
  nameStore: string; 
  persist?: {
    state: any
    storage?: any
  };
  computeState?: (state, prevState)=> void; 
  env: string; 
  initialState: any;
  actions: (get: any) => void;
  reduxDevTool?: boolean;
  logger?: boolean;
  middlewares?: [any]
}

export function createHookStore(options: OptionsStore) {
  const storeInstance = pipeMiddlewares({
    nameStore: options.nameStore,
    persistStore: options.persist ?? { state: null, storage: null },
    computeState: options.computeState,
    // env: options.env
    reduxDevTool: options.reduxDevTool,
    logger: options.logger,
    middlewares: options.middlewares || []

    
  });

  type StoreType = ReturnType<typeof storeInstance>;

  const stored = storeInstance((set, get) => ({
    ...options.initialState,
    name: options.nameStore,
    setDraft: (fn: any, name: string = '') => {
      const actionName = name || getCallingFunctionName();
      
      set(produce(get(), fn), false, actionName);
    },
    actions: options.actions(get),
  }))
  return createTrackedSelector(stored) as StoreType
}
