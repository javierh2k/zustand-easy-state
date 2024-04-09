import { useRef, createElement } from 'react';
import { createTrackedSelector } from 'react-tracked';

export function getProvider(initializeStore, Provider) {

  return ({
    children, serverStateProps,
  }) => {
    const storeRef = useRef<any>(null);
    const stored = initializeStore(serverStateProps);

    if (!storeRef.current) {
      storeRef.current = createTrackedSelector(stored as any);
    }

    return createElement(Provider, { value: { store: storeRef.current, instance: stored } }, children);
  };

}
