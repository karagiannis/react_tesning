import { useState, useEffect } from 'react';

/**
 * Custom hook för att spara och ladda state från localStorage
 * 
 * @param {string} key - localStorage key (t.ex. 'onboarding-wizard-steg1')
 * @param {any} initialValue - Initial value om ingen data finns i localStorage
 * @returns {[any, Function]} - [storedValue, setValue] precis som useState
 * 
 * Användning:
 * const [formData, setFormData] = useLocalStorage('onboarding-wizard-steg1', {
 *   affarsIde: '',
 *   foretagsnamn: '',
 *   ...
 * });
 */
export function useLocalStorage(key, initialValue) {
  // State för att hålla värdet
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // Försök hämta från localStorage
      const item = window.localStorage.getItem(key);
      // Parse sparad JSON eller returnera initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Uppdaterad setValue-funktion som sparar till localStorage
  const setValue = (value) => {
    try {
      // Tillåt att value är en funktion (precis som useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Spara state
      setStoredValue(valueToStore);
      
      // Spara till localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error saving localStorage key "${key}":`, error);
    }
  };

  // Lyssna på ändringar i andra flikar/fönster
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

/**
 * Hjälpfunktion för att rensa alla wizard-relaterade data från localStorage
 * Användbart vid logout eller när användaren börjar om från början
 */
export function clearWizardData() {
  const wizardKeys = [
    'onboarding-wizard-steg1',
    'onboarding-wizard-steg2',
    'onboarding-wizard-steg3',
    'onboarding-wizard-steg4',
  ];
  
  wizardKeys.forEach(key => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  });
}
