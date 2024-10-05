import { Draft } from "immer";
import type { PropsWithChildren } from 'react';
import { ClientState } from "./clientInitialState";
import { Client } from "./Client";

type DraftUpdater<T> = (draft: Draft<T>) => void;

export interface Actions {
    actions: {
        counter: () => void;
        onLoad: (initialState: Partial<ClientState> ) => void;
        saveClient: (client: Client) => Promise<void>;
    };
}
export interface SetDraft {
    setDraft: (fn: DraftUpdater<Store>, name?: string) => void;
}

export type Store = ClientState & Actions & SetDraft;
export type StoreAction<T> = (get: () => Store) => T;
export type Fields = Record<string, string>;
export type ClientProviderProps = PropsWithChildren<{
  serverStateProps: any;
}>;

