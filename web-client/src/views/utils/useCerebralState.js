import { sequences, state } from 'cerebral';

export function useCerebralState(get, bind, defaultValue) {
  let getter = get(state[bind]);

  const setter = newValue => {
    get(sequences.cerebralBindSimpleSetStateSequence)({
      key: bind,
      value: newValue,
    });
  };

  // default value
  if (!getter && defaultValue) {
    setter((getter = defaultValue));
  }

  return [getter, setter];
}

export function decorateWithPostCallback(delegate, postCallbackFn) {
  if (!postCallbackFn) {
    return delegate;
  }

  return (...args) => {
    delegate(...args);
    postCallbackFn(...args);
  };
}

export function decorateWithPreemptiveCallback(delegate, preemptiveCallbackFn) {
  if (!preemptiveCallbackFn) {
    return delegate;
  }

  return (...args) => {
    if (preemptiveCallbackFn(...args)) {
      delegate(...args);
    }
  };
}
