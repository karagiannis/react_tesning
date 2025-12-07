/**
 * handleFieldChange
 * Uppdaterar ett fält i formData för en specifik slide
 *
 * ============================================================================
 * ANROPAS FRÅN: Alla formulärfält i alla slides
 * ============================================================================
 * 
 * PARAMETERS:
 *   slideKey - vilken slide (t.ex. 'uppdragsval')
 *   field    - vilket fält (t.ex. 'orgnr')
 *   value    - det nya värdet
 *
 * EFFEKT:
 *   1. Lägger till ändringen i formHistory (audit trail)
 *   2. Uppdaterar formData immutably
 *   3. localStorage-sparning sker automatiskt via useAutoSave (debounced)
 *
 * ============================================================================
 * JÄMFÖR MED TIC-TAC-TOE:
 * ============================================================================
 * 
 * Detta är som handleClick - vi uppdaterar ett värde immutably
 *
 * I tic-tac-toe:
 *   const nextSquares = squares.slice();  // Kopiera
 *   nextSquares[i] = 'X';                  // Uppdatera
 *   setSquares(nextSquares);              // Spara
 *
 * Här:
 *   const newFormData = { ...formData };   // Kopiera
 *   newFormData[slideKey][field] = value;  // Uppdatera
 *   setFormData(newFormData);              // Spara
 *
 * OBS: localStorage-sparning hanteras av useAutoSave (debounced!)
 */
export const createHandleFieldChange = ({ setFormHistory, formData, setFormData }) => {
  return (slideKey, field, value) => {
    // 1. Lägg till i form history (för audit trail och undo)
    setFormHistory(prev => [...prev, {
      slideKey,
      field,
      oldValue: formData[slideKey]?.[field],  // Spara gamla värdet!
      newValue: value,
      timestamp: Date.now(),
    }]);

    // 2. Uppdatera React state med FUNCTIONAL UPDATE för att undvika race conditions
    //    Detta säkerställer att vi alltid arbetar med senaste versionen av state
    //    (localStorage-sparning sker automatiskt via useAutoSave med debounce)
    setFormData(prevFormData => {
      const newFormData = {
        ...prevFormData,
        [slideKey]: {
          ...prevFormData[slideKey],
          [field]: value,
        },
      };
      
      return newFormData;
    });
  };
};
