import expect, { spyOn } from 'expect';
import { createStore } from 'redux';
import { replaceState, paste } from '../src/enhancers/replaceState';


function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT': return state + 1;
  case 'DECREMENT': return state - 1;
  default: return state;
  }
}

function complexCounter(state = { counter: 0 }, action) {
  switch (action.type) {
  case 'INCREMENT': return { counter: state.counter + 1 };
  case 'DECREMENT': return { counter: state.counter - 1 };
  default: return state;
  }
}

global.console.error = () => {};
describe('replaceState', () => {
  it('should be a function', () => {
    expect(replaceState).toBeA('function');
  });

  it('should return a function', () => {
    expect(replaceState()).toBeA('function');
  });

  describe('should be able to replace the state with a new one', () => {
    it('#reducers works as expected', () => {
      const store = replaceState()(createStore)(counter);
      expect(store.getState()).toEqual(0);

      store.dispatch({ type: 'INCREMENT' });
      expect(store.getState()).toEqual(1);
    });

    it('#simple state', () => {
      const store = replaceState()(createStore)(counter);

      store.dispatch({ type: 'INCREMENT' });
      store.dispatch(paste('5'));
      expect(store.getState()).toEqual(5);
    });

    it('#complex state', () => {
      const store = replaceState()(createStore)(complexCounter);

      store.dispatch({ type: 'INCREMENT' });
      store.dispatch(paste(`{"counter": 12}`));

      expect(store.getState()).toEqual({ counter: 12 });
    });

    it(`#doesn't change when malformed and fire error`, () => {
      const store = replaceState()(createStore)(complexCounter);
      const spy = spyOn(global.console, 'error');

      expect(store.getState()).toEqual({ counter: 0 });

      store.dispatch({ type: 'INCREMENT' });
      expect(store.getState()).toEqual({ counter: 1 });

      store.dispatch(paste(`{"counter": 12`));
      expect(store.getState()).toEqual({ counter: 1 });

      expect(spy).toHaveBeenCalled();
    });
  });
});

describe('paste', () => {
  describe('should create an action', () => {
    let pasted;
    beforeEach(() => {
      pasted = paste('3');
    });

    it('with a type', () => {
      expect(pasted.type).toExist();
    });

    it('with a replaced state', () => {
      expect(pasted.payload).toEqual(3);
    });
  });

  describe('should not add a payload if malformed', () => {
    const spy = spyOn(global.console, 'error');
    expect(paste(`{"counter": 12`).payload).toNotExist();
    expect(spy).toHaveBeenCalled();
  });
});
