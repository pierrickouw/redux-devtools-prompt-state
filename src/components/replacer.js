import Mousetrap from 'mousetrap';
import invariant from 'invariant';

import { paste } from '../enhancers/replaceState';

export function replacer(store, keys = ['shift+s']) {
  invariant(typeof store.dispatch === 'function', 'You should pass a store');
  invariant(Array.isArray(keys), 'keys should be an array');

  Mousetrap.bind(keys, () => {
    const value = window.prompt('Paste your state', JSON.stringify(store.getState()));
    if (value) {
      const action = paste(value);
      store.dispatch(action);
    }
  });
}
