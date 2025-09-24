export const userSchema = {
  type: 'object',
  required: ['id','email','first_name','last_name','avatar'],
  properties: {
    id: { type: 'integer' },
    email: { type: 'string', format: 'email' },
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    avatar: { type: 'string' }
  },
  additionalProperties: true
};

export const usersResponseSchema = {
  type: 'object',
  required: ['page','per_page','total','total_pages','data'],
  properties: { data: { type: 'array', items: userSchema } },
  additionalProperties: true
};

export const createdUserSchema = {
  type: 'object',
  required: ['name','job','id','createdAt'],
  properties: {
    name: { type: 'string', minLength: 1 },
    job: { type: 'string', minLength: 1 },
    id: { type: 'string' },
    createdAt: { type: 'string' }
  },
  additionalProperties: true
};

export const authResponseSchema = {
  type: 'object',
  required: ['token'],
  properties: { token: { type: 'string', minLength: 1 } },
  additionalProperties: true
};

export const errorResponseSchema = {
  type: 'object',
  required: ['error'],
  properties: { error: { type: 'string', minLength: 1 } },
  additionalProperties: true
};

// User details response schema, with reusable `user` definition:
export const singleUserResponseSchema = {
  type: 'object',
  required: ['data'],
  properties: { data: { $ref: '#/defs/user' } },
  additionalProperties: true,
  defs: { user: /** reuse */ undefined }
};
// ↓ dacă nu ai `defs`, folosește direct userSchema:
export const singleUserResponseSchema_alt = {
  type: 'object',
  required: ['data'],
  properties: { data: /* importă */ userSchema },
  additionalProperties: true
};

export const updatedUserSchema = {
  type: 'object',
  required: ['name','job','updatedAt'],
  properties: {
    name: { type: 'string', minLength: 1 },
    job: { type: 'string', minLength: 1 },
    updatedAt: { type: 'string' }
  },
  additionalProperties: true
};
