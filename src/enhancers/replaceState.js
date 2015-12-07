
/* eslint no-console:0 */

const REPLACE_STATE = 'REPLACE_STATE';

function isUndefined(myVar) {
  return typeof myVar === 'undefined';
}

function augmentReducer(reducer, initialState) {
  return (state = initialState, action) => {
    const { type, payload } = action;

    if (type === REPLACE_STATE && !isUndefined(payload)) {
      return payload;
    }

    return reducer(state, action);
  };
}

function parseState(state) {
  try {
    return JSON.parse(state);
  } catch (error) {
    console.error(`Error in the provided state for replacement: ${state}`, error);
  }
}

export function paste(state) {
  const payload = parseState(state);
  return { type: REPLACE_STATE, payload };
}

export function replaceState() {
  return next => (reducer, initialState) => next(augmentReducer(reducer, initialState));
}

