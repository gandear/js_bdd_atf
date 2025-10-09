// src/api/schemas/schemas.js

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base user schema 
 */
export const userSchema = {
  type: 'object',
  required: ['id', 'email', 'first_name', 'last_name', 'avatar'],
  properties: {
    id: { type: 'integer' },
    email: { type: 'string', format: 'email' },
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    avatar: { type: 'string', format: 'uri' },
  },
  additionalProperties: true
};

/**
 * Support object schema
 */
export const supportSchema = {
  type: 'object',
  required: ['url', 'text'],
  properties: {
    url: { type: 'string', format: 'uri' },
    text: { type: 'string', minLength: 1 }
  },
  additionalProperties: true
};

export const metaSchema = {
  type: 'object',
  required: ['powered_by', 'upgrade_url', 'docs_url'],
  properties: {
    powered_by: { type: 'string', minLength: 1 },
    upgrade_url: { type: 'string', format: 'uri' },
    docs_url: { type: 'string', format: 'uri' },
  },
  additionalProperties: true
};

// ============================================================================
// GET ENDPOINTS - Response schemas
// ============================================================================

/**
 * GET /api/users?page={page}
 * Returns paginated list of users, incluzând support și meta.
 */
export const usersResponseSchema = {
  type: 'object',
  required: ['page', 'per_page', 'total', 'total_pages', 'data', 'support', '_meta'],
  properties: {
    page: { type: 'integer' },
    per_page: { type: 'integer' },
    total: { type: 'integer' },
    total_pages: { type: 'integer' },
    data: { type: 'array', items: userSchema },
    support: supportSchema, 
    _meta: metaSchema 
  },
  additionalProperties: true
};

/**
 * GET /api/users/{id}
 * Returns single user details, incluzând support și meta.
 */
export const singleUserResponseSchema = {
  type: 'object',
  required: ['data', 'support', '_meta'],
  properties: { 
    data: userSchema,
    support: supportSchema, 
    _meta: metaSchema 
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
    id: { type: 'string', minLength: 1 },
    createdAt: { type: 'string', format: 'date-time' }
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
    updatedAt: { type: 'string', format: 'date-time' }
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