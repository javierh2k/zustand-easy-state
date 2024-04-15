import { produce } from 'immer';
import { pipeMiddlewares } from './pipeMiddlewares';

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

type PropOptions = { 
  nameStore: string; 
  persist: {
    state: any
    storage?: any
  };
  computeState: ()=> void; 
  env: string; 
  initialState: any;
  actions: (arg: any) => void;
}

export function getCustomStore<T>(options: PropOptions) {

  const storeInstance = pipeMiddlewares({
    nameStore: options.nameStore,
    persist: options.persist ?? { state: null, storage: null },
    computeState: options.computeState,
    env: options.env
});

  return (preloadedState: Partial<T>) => storeInstance((set: (arg0: (base?: any, ...args: unknown[]) => any, arg1: boolean, arg2: string) => void, get: () => any) => ({
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
