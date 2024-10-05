import { produce } from 'immer';
import { pipeMiddlewares } from './pipeMiddlewares';

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


export function getCustomStore<T>(options) {

  const storeInstance = pipeMiddlewares({
    nameStore: options.nameStore,
    persistStore: options.persistStore,
    computeState: options.computeState,
    env: options.env
});

  return (preloadedState: Partial<T>) => storeInstance((set, get) => ({
    ...options.initialState,
    ...preloadedState,
    name: options.nameStore,
    setDraft: (fn: any, name: string = '') => {
      const actionName = name || getCallingFunctionName();
      set(produce(get(), fn), false, actionName);
    },
    actions: options.actions(get),
  }));

}
