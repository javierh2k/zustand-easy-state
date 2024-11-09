/* eslint-disable @typescript-eslint/no-unsafe-return */
import { create } from 'zustand';
import {
 devtools,
 persist,
 createJSONStorage,
 subscribeWithSelector,
} from 'zustand/middleware';
import { createTrackedSelector } from 'react-tracked';
import { produce } from 'immer';


import PubStore from './PubStore';
import { pipe } from './pipe';
// import { computed } from './customComputedMiddleware';

// export const pipe = (...ops) => ops.reduce((a, b) => (...args) => b(a(...args)));

export const updateNestedState = (set, keyPath, value) => {
 set(
   (state) => {
     const keys = keyPath.split('.');


     let nestedState = {...state};


     keys.slice(0, -1).forEach((key) => {
       nestedState = nestedState[key];
     });
     nestedState[keys[keys.length - 1]] = value;


     return nestedState;
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
 /// \s+at\s+(\S+)/.exec(callerLine)[1];
 return functionName;
}


export interface BearState {
 bears: number;
 increase: (by: number) => void;
}


const Publish = new PubStore('key');


export const bearStore = Publish.defineStore<BearState>('bearStore', (set) => ({
 bears: 8,
 increase: (by) => set((state) => ({ bears: state.bears + by })),
}));


type CreateStoreProps<T> = {
 name: string;
 env: string;
 logger?: boolean;
 reduxDevTool?: boolean;
 initialState: Omit<T, 'actions' | 'setDraft' | 'setTransient'>;
 actions: (get: () => T, set?: any) => void;
 persistStore?: {
   enabled: boolean;
   props: (state: Omit<T, 'actions'>) => Partial<Omit<T, 'actions'>>;
 };
 computeState?: {
  enabled: boolean,
  actions: any,
 },
 middlewares?: any[];
};


export function createStoreMFE<T extends object>({
 name,
 persistStore,
 env,
 logger,
 reduxDevTool,
//  computeState,
 initialState,
 actions,
 middlewares = [],
}: CreateStoreProps<T>) {
 const storeDevTools = (state) =>
   devtools(state, { name, enabled: reduxDevTool || env === 'development' });
//  console.log({env, bol: env === 'development'})

 const enableLogging = logger; // ?? (window as any).zustandLogger;
 const storePersisted = (state) =>
   persistStore?.enabled
     ? persist(state, {
         name,
         storage: createJSONStorage(() => sessionStorage),
         partialize: persistStore.props,
       })
     : state;

      //  console.log(enableLogging, 'enableLogging')


       const storeLogger = (config) => (set, get, api) =>
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

  // const storeComputed = (name) => (state) =>
  //   computeState?.enabled ? computed(state, computeState.actions, name) : state;
// storeComputed
   const pipes = pipe(storeDevTools, storePersisted,  storeLogger, ...middlewares);

 const instance = Publish.defineStore<
   T,
   [
     ['zustand/subscribeWithSelector', T],
     ['zustand/persist', T],
     ['zustand/devtools', T],
   ]
 >(
   name,
   subscribeWithSelector(
     pipes((set, get) => ({
           ...initialState,
           setTransient: (path: string, value: string) =>
             updateNestedState(set, path, value),
           setDraft: (fn: any, actionNameProp = '', transientObject) => {
             const actionName = actionNameProp || getCallingFunctionName();

            if(!!transientObject){
              set(transientObject, true)
            }else{
              set(produce(get(), fn), false, actionName);
            }
           },


           actions: actions(get, set),
         })),

   ),
 );


 const store = () => createTrackedSelector(create(Publish.getStore(name)));


 return { store, instance };
}


// type State = {
//  inputText: string;
//  appInfo: {
//    name: string;
//    detail: {
//      status: {
//        value: string;
//      };
//    };
//  };
//  value: string;
// };


// type Actions = {
//  actions: {
//    setAppName: (val: string) => void;
//    setValue: (val: string) => void;
//  };
// };


// export type StoreBear = Actions &
//  State & {
//    setTransient: (path: string, value: string) => void;
//    setDraft: (fn: any, name?: string, transient?: boolean) => void;
//  };


// const { store, instance } = createStore<StoreBear>({
//  name: 'platformStore',
//  env: 'development',
//  initialState: {
//    appInfo: {
//      name: '999',
//      detail: {
//        status: {
//          value: 'active',
//        },
//      },
//    },
//    value: '',
//    inputText: '',
//  },
//  actions: (_, set) => ({
//    setIframeSwitch(val) {
//      set({
//        iframeSwitch: val,
//      });
//    },
//    setAppName(val) {
//      set((origin) => ({
//        ...origin,
//        appInfo: {
//          name: val,
//        },
//      }));
//    },
//    setValue(val) {
//      set({
//        value: val,
//      });
//    },
//  }),
// });


// export const usePlatformStore = store();


// export const instanceStore = instance;
