// src/utils/sanitize.js
export function sanitizeSegment(s, fallback = 'unknown') {
  return(s ?? fallback)
    .trim()
    .replace(/[\\/:*?"<>|]/g, '_')  // caractere ilegale în nume de fișiere
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '_');
}

export default sanitizeSegment;