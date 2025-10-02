// src/api/schemas/schemas.js

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base user/product schema
 * Note: ReqRes.in now returns products (colors) instead of actual users
 */
export const userSchema = {
  type: 'object',
  required: ['id', 'name', 'year', 'color', 'pantone_value'],
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    year: { type: 'integer' },
    color: { type: 'string' },
    pantone_value: { type: 'string' }
  },
  additionalProperties: true
};

// ============================================================================
// GET ENDPOINTS - Response schemas
// ============================================================================

/**
 * GET /api/users?page={page}
 * Returns paginated list of users
 */
export const usersResponseSchema = {
  type: 'object',
  required: ['page', 'per_page', 'total', 'total_pages', 'data'],
  properties: {
    page: { type: 'integer' },
    per_page: { type: 'integer' },
    total: { type: 'integer' },
    total_pages: { type: 'integer' },
    data: { type: 'array', items: userSchema }
  },
  additionalProperties: true
};

/**
 * GET /api/users/{id}
 * Returns single user details
 */
export const singleUserResponseSchema = {
  type: 'object',
  required: ['data'],
  properties: { 
    data: userSchema 
  },
  additionalProperties: true
};

// ============================================================================
// POST/PUT ENDPOINTS - Response schemas
// ============================================================================

/**
 * POST /api/users
 * Returns created user with generated id and timestamp
 */
export const createdUserSchema = {
  type: 'object',
  required: ['name', 'job', 'id', 'createdAt'],
  properties: {
    name: { type: 'string', minLength: 1 },
    job: { type: 'string', minLength: 1 },
    id: { type: 'string' },
    createdAt: { type: 'string' }
  },
  additionalProperties: true
};

/**
 * PUT /api/users/{id}
 * Returns updated user with timestamp
 */
export const updatedUserSchema = {
  type: 'object',
  required: ['name', 'job', 'updatedAt'],
  properties: {
    name: { type: 'string', minLength: 1 },
    job: { type: 'string', minLength: 1 },
    updatedAt: { type: 'string' }
  },
  additionalProperties: true
};

// ============================================================================
// AUTH ENDPOINTS - Response schemas
// ============================================================================

/**
 * POST /api/login
 * POST /api/register
 * Returns authentication token on success
 */
export const authResponseSchema = {
  type: 'object',
  required: ['token'],
  properties: { 
    token: { type: 'string', minLength: 1 } 
  },
  additionalProperties: true
};

// ============================================================================
// ERROR SCHEMAS
// ============================================================================

/**
 * Generic error response (400, 404, etc.)
 * Returns error message
 */
export const errorResponseSchema = {
  type: 'object',
  required: ['error'],
  properties: { 
    error: { type: 'string', minLength: 1 } 
  },
  additionalProperties: true
};