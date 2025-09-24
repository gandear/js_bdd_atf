// src/utils/sanitize.js
export const sanitizeSegment = (s, fallback = 'unknown') =>
  String(s ?? fallback)
    .trim()
    .replace(/[\\/:*?"<>|]/g, '_')  // caractere ilegale în nume de fișiere
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '_');
