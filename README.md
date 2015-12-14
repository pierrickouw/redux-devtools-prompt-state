## redux-devtools-prompt-state

This is a small module to debug redux app.
After the setup, just press `shift+s` by default to see a prompt of your current state.
You can save it for later use, or replace it with another one.

<img width="400" src="http://pierrickouw.org/images/screenredux.gif"/>

### Setup
`npm i --save-dev redux-devtools-prompt-state`

Be careful to only put this in dev - use a flag in your build! (or be aware in prod)

Create your store with the `replaceState` enhancers
``` javascript
import { createStore, compose } from 'redux'
import rootReducer from '../reducers'
import { replaceState, replacer } from 'redux-devtools-prompt-state';

function configureStore(initialState)
{
  const createWithReplaceState = compose(replaceState())(createStore); // replaceState can take an array of key sequence
  const store = createWithReplaceState(rootReducer, initialState);
  replacer(store, [ 'shift+k' ]); // replacer for dom - could be extended in the future

  return store
}
```

#### `replaceState`

`replacer(store, keys)` takes an array of key sequences as second argument as defined [here](https://craig.is/killing/mice)
