import actions from './clientActions';
import initialState, { ClientState } from './clientInitialState';
import { computeState } from './clientComputeState';
import { createStore } from '../../dist/main';

const options = {
  nameStore: 'clientStore',
  persistStore: (state: ClientState) => ({
    client: state.client
  }),
  computeState,
  initialState,
  actions,
};

export const useClientStore = createStore(options)
