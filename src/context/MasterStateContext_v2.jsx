/**
 * MasterStateContext_v2.jsx
 * 
 * Context provider för useMasterState_v2
 * 
 * ANVÄNDNING:
 * 
 * // I App.jsx:
 * <MasterStateProvider>
 *   <Routes>...</Routes>
 * </MasterStateProvider>
 * 
 * // I en slide:
 * const { state, actions } = useMasterContext();
 * 
 * <button onClick={actions.next}>Nästa</button>
 * <button onClick={actions.back}>Tillbaka</button>
 * <input onChange={(e) => actions.updateField('mySlide', 'myField', e.target.value)} />
 */

import { createContext, useContext, useEffect } from 'react';
import { useMasterState } from '../hooks/useMasterState_v2';

// Skapa context
const MasterStateContext = createContext(null);

/**
 * Provider-komponent
 */
export function MasterStateProvider({ children }) {
  const masterState = useMasterState();
  
  // Initiera vid mount
  useEffect(() => {
    masterState.actions.initialize();
  }, []);
  
  return (
    <MasterStateContext.Provider value={masterState}>
      {children}
    </MasterStateContext.Provider>
  );
}

/**
 * Hook för att använda context
 */
export function useMasterContext() {
  const context = useContext(MasterStateContext);
  
  if (!context) {
    throw new Error('useMasterContext must be used within a MasterStateProvider');
  }
  
  return context;
}

/**
 * HOC för slides som behöver context
 * 
 * ANVÄNDNING:
 * export default withMasterState(MySlide);
 */
export function withMasterState(Component) {
  return function WrappedComponent(props) {
    const masterContext = useMasterContext();
    return <Component {...props} {...masterContext} />;
  };
}

export default MasterStateContext;
