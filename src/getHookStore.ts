import { useContext } from 'react';

export function getHookStore<T>(ctx: any) {
  interface StoreInstance<T> {
    store: () => T;
    instance: T;
  }
  return (instance = '') => {
    const storeWizard = useContext(ctx) as StoreInstance<T>;
    if (!storeWizard) {
      throw new Error('Store is missing the provider');
    }

    if (instance === 'instance') {
      return {store: storeWizard.store(), instance: storeWizard.instance};
    }

    return storeWizard.store();
  };
}
