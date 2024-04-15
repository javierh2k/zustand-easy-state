import actions from './clientActions';
import initialState, { ClientState } from './clientInitialState';
import { computeState } from './clientComputeState';
import { createHookStore } from '../../dist/main';
import  secureLocalStorage  from  "react-secure-storage";

const storage = {
  getItem: (name: string) => {
    return secureLocalStorage.getItem(name);
  },
  setItem: <T>(name: string, value: T) => {
    secureLocalStorage.setItem(name, JSON.stringify(value))
  },
  removeItem: (name: string) => secureLocalStorage.removeItem(name),
}

const options = {
  nameStore: 'clientStore',
  persist:{
    state: (state: ClientState) => ({
      client: state.client
    }),
    // storage
  },
  computeState,
  env: 'development',
  initialState,
  actions,
};

export const useClientStore = createHookStore(options)
