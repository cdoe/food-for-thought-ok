// Core
import { useState, useEffect } from 'react';

function useSessionState(defaultState: any, id: string) {
  // Pull value from session storage
  const sessionVal = JSON.parse(sessionStorage.getItem(id) || '{}');
  const sessionValIsSet = sessionStorage.getItem(id) !== null;

  // Set state to session value if present
  // otherwise set state to default
  const initialState = sessionValIsSet ? sessionVal : defaultState;
  const [sessionState, setSessionState] = useState(initialState);

  // Update session storage any time state changes
  useEffect(() => {
    sessionStorage.setItem(id, JSON.stringify(sessionState));
  }, [sessionState]);

  return [sessionState, setSessionState];
}

export default useSessionState;
