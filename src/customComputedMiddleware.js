import { diff } from 'deep-object-diff';

const mock = { log: () => {}, table: () => {} };
const logger = process.env.NODE_ENV === 'production' ? mock : console;

function simpleObjectDiff(obj1, obj2) {
  return Object.fromEntries(
    Object.entries(obj1).filter(([key, value]) => value !== obj2[key]),
  );
}

export const computed =
  (initialStore, storeComputed, nameStore) => (set, get, api) => {
    const setWithComputed = (update, replace) => {
      set((state) => {
        const updatedProps =
          typeof update === 'function' ? update(state) : update;

        // : typeof update === 'object'? update: state;
        // logger.log('....',);
        // const { name: nameStore = 'store' } = get();
        // console.log('updatedProps::', update, updatedProps, state);
        logger.log(
          `%c::::::::::: state::${nameStore} ::::::`,
          'color: red',
        );

        if (
          updatedProps &&
          Object.keys(updatedProps).length === Object.keys(state).length
        ) {
          logger.table(diff(state, updatedProps));
        } else {
          logger.table(updatedProps);
        }

        const updated = { ...state, ...updatedProps };

        logger.log(`New state ${nameStore} `, updated);

        const computedState = storeComputed(updated, get());

        logger.log(`%c::::::::::: End :::::::::::::::::`, 'color: red');
        logger.log('');
        logger.log('');

        return { ...updated, ...computedState };
      }, replace);
    };

    api.setState = setWithComputed;

    const state = initialStore(setWithComputed, get, api);

    return { ...state, ...storeComputed(state, get()) };
  };
