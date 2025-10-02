// src/api/schemas/schemas.js

// Schema pentru user/product (ReqRes.in now returns products instead of users)
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

// Schema pentru lista de users (GET /api/users?page=)
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

// Schema pentru single user response (GET /api/users/{id})
export const singleUserResponseSchema_alt = {
  type: 'object',
  required: ['data'],
  properties: { 
    data: userSchema 
  },
  additionalProperties: true
};

// Schema pentru user creat (POST /api/users)
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

// Schema pentru user actualizat (PUT /api/users/{id})
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

// Schema pentru autentificare reușită (POST /api/login, /api/register)
export const authResponseSchema = {
  type: 'object',
  required: ['token'],
  properties: { 
    token: { type: 'string', minLength: 1 } 
  },
  additionalProperties: true
};

// Schema pentru erori (400, 404, etc.)
export const errorResponseSchema = {
  type: 'object',
  required: ['error'],
  properties: { 
    error: { type: 'string', minLength: 1 } 
  },
  additionalProperties: true
};

// Alias pentru compatibilitate (dacă e folosit în alte locuri)
export const singleUserResponseSchema = singleUserResponseSchema_alt;