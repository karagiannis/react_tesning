/**
 * conflictDiff.js
 * 
 * Utility för att beräkna diff mellan server- och lokal data.
 * Används av useSlideDataLoader och slideNavigation för att 
 * förbereda data till MergeConflictModal (dum komponent).
 * 
 * MergeConflictModal får BARA färdigberäknade värden - den gör
 * ingen logik själv enligt tic-tac-toe-mönstret.
 */

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE-NAMN ÖVERSÄTTNING
// ═══════════════════════════════════════════════════════════════════════════

const SLIDE_NAMES = {
  'uppdragsval': 'Uppdragsval',
  'riskfragor-1': 'Riskfrågor (steg 1)',
  'riskfragor-2': 'Riskfrågor (steg 2)',
  'riskfragor-3': 'Riskfrågor (steg 3)',
  'riskfragor-4': 'Riskfrågor (steg 4)',
  'verksamhet': 'Verksamhet',
  'agarstruktur': 'Ägarstruktur',
  'styrelse': 'Styrelse',
  'ovriga-data': 'Övriga data',
  'riskindikatorer': 'Riskindikatorer',
  'bokforingsdata': 'Bokföringsdata',
  'bokforing-data': 'Bokföringsdata',
  'foretagsdokumentation': 'Företagsdokumentation',
  'bokforingsunderlag': 'Bokföringsunderlag',
  'avtal': 'Avtal',
};

export function getSlideDisplayName(slideKey) {
  return SLIDE_NAMES[slideKey] || slideKey;
}

// ═══════════════════════════════════════════════════════════════════════════
// VÄRDE-FORMATERING
// ═══════════════════════════════════════════════════════════════════════════

export function formatValue(value) {
  if (value === null || value === undefined) return '(tom)';
  if (value === true) return '✓ Ja';
  if (value === false) return '✗ Nej';
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      if (value.length === 0) return '(tom lista)';
      return value.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(', ');
    }
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

// Gör sökvägar mer läsbara
export function formatPath(path) {
  return path
    .replace(/\./g, ' → ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ');
}

// ═══════════════════════════════════════════════════════════════════════════
// GENERISK DIFF-MOTOR
// Jämför två objekt rekursivt och returnerar lista med skillnader
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jämför två värden och returnerar diff-resultat
 * @returns {Array} Lista med {path, serverValue, localValue, type, formattedPath, formattedServerValue, formattedLocalValue}
 */
export function computeDiff(serverData, localData, path = '') {
  const diffs = [];
  
  // Hantera null/undefined
  const serverIsEmpty = serverData === null || serverData === undefined;
  const localIsEmpty = localData === null || localData === undefined;
  
  if (serverIsEmpty && localIsEmpty) {
    return diffs; // Båda tomma = ingen diff
  }
  
  if (serverIsEmpty || localIsEmpty) {
    // En är tom, den andra har data
    const diffPath = path || '(root)';
    diffs.push({
      path: diffPath,
      formattedPath: formatPath(diffPath),
      serverValue: serverIsEmpty ? '(tom)' : serverData,
      localValue: localIsEmpty ? '(tom)' : localData,
      formattedServerValue: serverIsEmpty ? '(tom)' : formatValue(serverData),
      formattedLocalValue: localIsEmpty ? '(tom)' : formatValue(localData),
      type: serverIsEmpty ? 'added' : 'removed'
    });
    return diffs;
  }
  
  // Olika typer
  const serverType = typeof serverData;
  const localType = typeof localData;
  
  if (serverType !== localType) {
    const diffPath = path || '(root)';
    diffs.push({
      path: diffPath,
      formattedPath: formatPath(diffPath),
      serverValue: serverData,
      localValue: localData,
      formattedServerValue: formatValue(serverData),
      formattedLocalValue: formatValue(localData),
      type: 'modified'
    });
    return diffs;
  }
  
  // Primitiva värden
  if (serverType !== 'object') {
    if (serverData !== localData) {
      const diffPath = path || '(root)';
      diffs.push({
        path: diffPath,
        formattedPath: formatPath(diffPath),
        serverValue: serverData,
        localValue: localData,
        formattedServerValue: formatValue(serverData),
        formattedLocalValue: formatValue(localData),
        type: 'modified'
      });
    }
    return diffs;
  }
  
  // Arrays
  if (Array.isArray(serverData) && Array.isArray(localData)) {
    const serverStr = JSON.stringify(serverData);
    const localStr = JSON.stringify(localData);
    if (serverStr !== localStr) {
      const diffPath = path || '(root)';
      diffs.push({
        path: diffPath,
        formattedPath: formatPath(diffPath),
        serverValue: serverData,
        localValue: localData,
        formattedServerValue: formatValue(serverData),
        formattedLocalValue: formatValue(localData),
        type: 'modified',
        isArray: true
      });
    }
    return diffs;
  }
  
  // Objekt - rekursiv jämförelse
  const allKeys = new Set([
    ...Object.keys(serverData || {}),
    ...Object.keys(localData || {})
  ]);
  
  for (const key of allKeys) {
    const newPath = path ? `${path}.${key}` : key;
    const serverVal = serverData?.[key];
    const localVal = localData?.[key];
    
    diffs.push(...computeDiff(serverVal, localVal, newPath));
  }
  
  return diffs;
}

// ═══════════════════════════════════════════════════════════════════════════
// FULL COMPARISON - Visar ALLA fält (som Git diff, inte bara ändringar)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jämför två objekt och returnerar ALLA fält med status (same/different)
 * Precis som Git visar hela filen med ändringar markerade.
 * 
 * @returns {Array} Lista med {path, serverValue, localValue, isDifferent, formattedPath, ...}
 */
export function computeFullComparison(serverData, localData, path = '') {
  const results = [];
  
  // Hantera null/undefined
  const serverIsEmpty = serverData === null || serverData === undefined;
  const localIsEmpty = localData === null || localData === undefined;
  
  if (serverIsEmpty && localIsEmpty) {
    return results;
  }
  
  // Primitiva värden eller en sida tom
  const serverType = typeof serverData;
  const localType = typeof localData;
  
  if (serverIsEmpty || localIsEmpty || serverType !== localType || serverType !== 'object') {
    const diffPath = path || '(root)';
    const isDifferent = serverIsEmpty || localIsEmpty || serverData !== localData;
    results.push({
      path: diffPath,
      formattedPath: formatPath(diffPath),
      serverValue: serverIsEmpty ? null : serverData,
      localValue: localIsEmpty ? null : localData,
      formattedServerValue: serverIsEmpty ? '(tom)' : formatValue(serverData),
      formattedLocalValue: localIsEmpty ? '(tom)' : formatValue(localData),
      isDifferent,
      type: isDifferent ? 'modified' : 'same'
    });
    return results;
  }
  
  // Arrays - jämför som helhet
  if (Array.isArray(serverData) && Array.isArray(localData)) {
    const diffPath = path || '(root)';
    const serverStr = JSON.stringify(serverData);
    const localStr = JSON.stringify(localData);
    const isDifferent = serverStr !== localStr;
    results.push({
      path: diffPath,
      formattedPath: formatPath(diffPath),
      serverValue: serverData,
      localValue: localData,
      formattedServerValue: formatValue(serverData),
      formattedLocalValue: formatValue(localData),
      isDifferent,
      type: isDifferent ? 'modified' : 'same',
      isArray: true
    });
    return results;
  }
  
  // Objekt - rekursiv jämförelse av ALLA nycklar
  const allKeys = new Set([
    ...Object.keys(serverData || {}),
    ...Object.keys(localData || {})
  ]);
  
  for (const key of allKeys) {
    const newPath = path ? `${path}.${key}` : key;
    const serverVal = serverData?.[key];
    const localVal = localData?.[key];
    
    results.push(...computeFullComparison(serverVal, localVal, newPath));
  }
  
  return results;
}

// ═══════════════════════════════════════════════════════════════════════════
// BYGGA CONFLICT INFO FÖR MODAL (färdigberäknat!)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Bygger ett komplett conflictInfo-objekt med alla värden färdigberäknade.
 * MergeConflictModal får BARA rendera - ingen logik.
 * 
 * @param {Object} params
 * @param {string} params.slideKey - t.ex. 'riskfragor-1'
 * @param {Object} params.serverData - Server slide data
 * @param {Object} params.localData - Local slide data
 * @param {number} params.serverVersion - Server version nummer
 * @param {string} params.modifiedBy - User ID som ändrade
 * @param {string} params.modifiedByEmail - Email (läsbar)
 * @param {string} params.updatedAt - Timestamp
 * @returns {Object} Färdigberäknat conflictInfo för modal
 */
export function buildConflictInfo({
  slideKey,
  serverData,
  localData,
  serverVersion,
  modifiedBy,
  modifiedByEmail,
  updatedAt,
  message
}) {
  // Beräkna FULL comparison (alla fält, som Git) HÄR - inte i modalen!
  const fullComparison = computeFullComparison(serverData, localData);
  
  // Separera i samma/olika för enkel rendering
  const sameFields = fullComparison.filter(f => !f.isDifferent);
  const differentFields = fullComparison.filter(f => f.isDifferent);
  
  // Formatera modified by display
  const modifiedByDisplay = modifiedByEmail || 
    (modifiedBy ? modifiedBy.slice(0, 8) + '...' : 'Okänd');
  
  return {
    // Färdigberäknade display-värden (modal renderar bara)
    slideKey,
    slideDisplayName: getSlideDisplayName(slideKey),
    serverVersion,
    modifiedByDisplay,
    updatedAt,
    message,
    
    // Färdigberäknad FULL comparison (alla fält, som Git)
    fullComparison,      // Alla fält
    sameFields,          // Fält som är lika
    differentFields,     // Fält som skiljer sig (gamla "diffs")
    
    // Bakåtkompatibilitet
    diffs: differentFields,  // Gamla namnet
    diffCount: differentFields.length,
    
    // Rå data (om modal behöver för något)
    _raw: {
      serverData,
      localData,
      modifiedBy,
      modifiedByEmail
    }
  };
}
