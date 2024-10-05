import { Client } from './Client';
import { Actions, Store } from './clientTypes';


function actions(get: ()=>Store): Actions['actions'] {
  function onLoad() {
    get().setDraft((draft)=> { draft.processing = false });
  }

  function counter() {
    get().setDraft((draft)=> { draft.count++ });
  }



  async function saveClient(client: Client) {

    get().setDraft((draft) => {
      draft.client = client;
    });
  }

  return {
    onLoad,
    saveClient,
    counter
  };
}

export default actions;
