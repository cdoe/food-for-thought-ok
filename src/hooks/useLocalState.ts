// Core
import { useState, useEffect } from 'react';

const dateTimeReviver = function(key: string, value: string) {
  // If key has "date" anywhere in the name
  // try to convert to a javascript date
  if (typeof key === 'string' && key.search(/date/i) > 0) {
    const date = new Date(value);
    // Only assign value if converted to valid date
    return !!date && !isNaN(date.getTime()) ? date : value;
  }
  return value;
};

function useLocalState<S>(defaultState: S, id: string) {
  // Pull value from local storage (if valid json string)
  let localVal;
  try {
    localVal = JSON.parse(localStorage.getItem(id) as string, dateTimeReviver);
  } catch {
    localVal = null;
  }

  // Set state to local value if present
  // otherwise set state to default
  const initialState = localVal !== null ? localVal : defaultState;
  const [localState, setLocalState] = useState(initialState);

  // Update local storage any time state changes
  useEffect(() => {
    if (localState !== null) {
      localStorage.setItem(id, JSON.stringify(localState));
    }
  }, [id, localState]);

  return [localState, setLocalState];
}

export default useLocalState;
