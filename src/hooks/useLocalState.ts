// Core
import { useState, useEffect } from 'react';

function useLocalState<S>(defaultState: S, id: string) {
  // Pull value from local storage (if valid json string)
  let localVal;
  try {
    localVal = JSON.parse(localStorage.getItem(id) as string);
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
  }, [localState]);

  return [localState, setLocalState];
}

export default useLocalState;
