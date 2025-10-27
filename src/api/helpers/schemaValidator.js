// src/api/helpers/schemaValidator.js

import { validate as validateWithCompiled, getValidator, clearCache as clearCompiledCache } from './compiledValidators.js';

export class SchemaValidator {
  static assert(schema, data) {
    // Delegate to precompiled validators; will throw on validation errors
    return validateWithCompiled(schema, data);
  }

  static clearCache() {
    clearCompiledCache();
  }
}