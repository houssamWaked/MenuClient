import axios from 'axios';

function normalizeBaseUrl(value) {
  if (typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim().replace(/\/+$/, '');
  if (!trimmed) {
    return '';
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function isLoopbackHost(value) {
  if (typeof value !== 'string' || !value) {
    return false;
  }

  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';
  } catch {
    return false;
  }
}

const envBase =
  typeof import.meta.env?.VITE_API_BASE_URL === 'string'
    ? normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL)
    : '';

const defaultProductionApi = 'https://menuapi-production.up.railway.app';
const defaultDevelopmentApi = 'http://localhost:3001';
const usingProdUnsafeLocalEnv = !import.meta.env.DEV && isLoopbackHost(envBase);
const baseURL =
  envBase && !usingProdUnsafeLocalEnv
    ? envBase
    : import.meta.env.DEV
      ? defaultDevelopmentApi
      : defaultProductionApi;

let authToken = null;

export const getAuthToken = () => authToken;

export const setAuthToken = (token) => {
  authToken = typeof token === 'string' && token.trim() ? token.trim() : null;
};

export const clearAuthToken = () => {
  authToken = null;
};

export const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  if (!authToken) {
    return config;
  }

  config.headers = config.headers || {};
  config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});
