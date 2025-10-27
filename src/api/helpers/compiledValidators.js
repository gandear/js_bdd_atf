// src/api/helpers/compiledValidators.js
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Cache compiled validators by schema object reference
const cache = new Map();

export function getValidator(schema) {
  if (cache.has(schema)) return cache.get(schema);
  const validate = ajv.compile(schema);
  cache.set(schema, validate);
  return validate;
}

export function validate(schema, data) {
  const validateFn = getValidator(schema);
  const ok = validateFn(data);
  if (!ok) {
    const msg = ajv.errorsText(validateFn.errors, { separator: '\n' });
    throw new Error(msg);
  }
  return true;
}

export function clearCache() {
  cache.clear();
}
