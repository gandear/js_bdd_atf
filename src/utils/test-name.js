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
  const sep = opts.sep ?? '_';
  const path = getTitlePath(testInfo);                 // ex: ["Login", "Login with Invalid...", "Example 1"]
  const last = path[path.length - 1] || '';
  const prev = path[path.length - 2] || '';

  const example = normalizeExampleLabel(last);
  const scenario = prev || last || testInfo.title || 'test';

  let name = example ? `${scenario}${sep}${example}` : scenario;

  return name;
}
