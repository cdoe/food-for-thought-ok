// Core
import { useState, useEffect } from 'react';

function useLocalState(defaultState: any, id: string) {
  // Pull value from local storage
  const localVal = JSON.parse(localStorage.getItem(id) || '{}');
  const localValIsSet = localStorage.getItem(id) !== null;

  // Set state to local value if present
  // otherwise set state to default
  const initialState = localValIsSet ? localVal : defaultState;
  const [localState, setLocalState] = useState(initialState);

  // Update local storage any time state changes
  useEffect(() => {
    localStorage.setItem(id, JSON.stringify(localState));
  }, [localState]);

  return [localState, setLocalState];
}

export default useLocalState;
