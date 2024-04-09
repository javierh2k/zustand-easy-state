import { produce } from 'immer';

/**
 *
 * @param {draft} draft
 * @returns new state
 */

export const computeState = (state, prevState) =>
  produce(state, (draft) => {
    if (state && prevState) {
      console.log(draft)
      // charactersCounterExample(draft);
    }
  });
