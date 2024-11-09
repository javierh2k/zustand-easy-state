
import { produce } from 'immer';
import { pipeMiddlewares } from './pipeMiddlewares';

import { createTrackedSelector } from 'react-tracked';

export const updateNestedState = (set, keyPath, value) => {
  set(
    (state) => {
      const keys = keyPath.split('.');
 
 
      let nestedState = {...state};
 
 
      keys.slice(0, -1).forEach((key) => {
        nestedState = nestedState[key];
      });
      nestedState[keys[keys.length - 1]] = value;
 
 
      return { ...state };
    },
    true,
    `Transient:${keyPath}`,
  );
 };
 
 
export function getCallingFunctionName() {
  const error = new Error();
  const stackTrace = String(error.stack).split('\n');
  // console.log('track::::', stackTrace)
  const f = stackTrace.findIndex((line) => line.includes('__awaiter'));
  const functionName = stackTrace[f + 1].trim().split(' ')[1];
  // console.log('functionName:::', functionName)
  ///\s+at\s+(\S+)/.exec(callerLine)[1];
  return functionName;
}


export function createStore(options) {
  const storeInstance = pipeMiddlewares({
    nameStore: options.nameStore,
    persistStore: options.persistStore,
    computeState: options.computeState,
    reduxDevTool: options.reduxDevTool,
    logger: options.logger,
    middlewares: options.middlewares || []

  });

  type StoreType = ReturnType<typeof storeInstance>;

  const stored = storeInstance((set, get) => ({
    ...options.initialState,
    name: options.nameStore,
    setDraft: (fn: any, name: string = '', transient=false) => {
      const actionName = name || getCallingFunctionName();
      set(produce(get(), fn), transient, actionName,);
    },
    setTransient: (path: string, value: any) =>
      updateNestedState(set,path,value)
    ,
    setTransientDraft: (fn: any, name: string = '') => {
      const actionName = name || getCallingFunctionName();
      set(produce(get(), fn), true, actionName);
    },
    actions: options.actions(get),
  }))
  return createTrackedSelector(stored) as StoreType
}
