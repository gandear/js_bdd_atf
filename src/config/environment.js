// src/config/environment.js
export const environments = {
  dev: {
    API_BASE_URL: 'https://reqres.in/api',
    API_TOKEN: 'reqres-free-v1',
    TIMEOUT: 5000,
    RETRY_COUNT: 1,
    PARALLEL_WORKERS: 4
  },
  
  staging: {
    API_BASE_URL: 'https://staging-reqres.in/api',
    API_TOKEN: 'staging-token',
    TIMEOUT: 10000,
    RETRY_COUNT: 2,
    PARALLEL_WORKERS: 2
  },
  
  prod: {
    API_BASE_URL: 'https://api.reqres.in/api',
    API_TOKEN: 'prod-token',
    TIMEOUT: 15000,
    RETRY_COUNT: 3,
    PARALLEL_WORKERS: 1
  }
};

export function getEnvironmentConfig() {
  const env = process.env.TEST_ENV || 'dev';
  return environments[env];
}