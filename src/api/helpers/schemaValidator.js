// src/api/helpers/schemaValidator.js

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

export class SchemaValidator {
  static cache = new Map();
  
  static assert(schema, data) {
    const key = JSON.stringify(schema);
    let validate = this.cache.get(key);
    
    if (!validate) {
      validate = ajv.compile(schema);
      this.cache.set(key, validate);
    }
    
    if (!validate(data)) {
      const msg = ajv.errorsText(validate.errors, { separator: '\n' });
      throw new Error(msg);
    }
    return true;
  }
  
  static clearCache() {
    this.cache.clear();
  }
}