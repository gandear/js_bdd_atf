// src/utils/test-name.js

export function getTitlePath(testInfo) {
  if (Array.isArray(testInfo?.titlePath)) return testInfo.titlePath;
  if (typeof testInfo?.titlePath === 'function') return testInfo.titlePath();
  return [testInfo?.title].filter(Boolean);
}

function normalizeExampleLabel(s = '') {
  // "Example 1", "Examples 1", "Example: 1", "Example #1" -> "Example_1"
  const m = String(s).match(/^(Example|Examples)\b[\s:#-]*(\d+)/i);
  return m ? `Example_${m[2]}` : null;
}

export function buildTestName(testInfo, opts = {}) {
  const separator = opts.separator ?? '_';
  const path = getTitlePath(testInfo);
  
  // ✅ FIX: Folosește ultimul element (scenario name), nu penultimul
  const last = path[path.length - 1] || testInfo.title || 'test';
  
  // ✅ Detectează dacă e Scenario Outline (Example #N)
  const example = normalizeExampleLabel(last);
  
  if (example) {
    // Scenario Outline: "Feature > Scenario > Example #1"
    const scenario = path[path.length - 2] || 'scenario';
    return `${scenario}${separator}${example}`;
  }
  
  // ✅ Scenario normal: folosește direct scenario name
  return last;
}