import axios from 'axios';

const envBase =
  typeof import.meta.env?.VITE_API_BASE_URL === 'string'
    ? import.meta.env.VITE_API_BASE_URL.trim()
    : '';

const normalizedEnvBase = (envBase || '').replace(/\/+$/, '');
const baseURL = normalizedEnvBase || '';

let authToken = null;

function resolveRequestUrl(config = {}) {
  const requestBase =
    typeof config.baseURL === 'string' && config.baseURL.trim()
      ? config.baseURL.trim()
      : globalThis.location?.origin ?? '';
  const requestPath = typeof config.url === 'string' ? config.url : '';

  try {
    return new URL(requestPath, requestBase || globalThis.location?.origin || 'http://localhost')
      .toString();
  } catch {
    return `${requestBase}${requestPath}`;
  }
}

function serializeResponseData(data) {
  if (data == null) {
    return null;
  }

  if (typeof data === 'string') {
    return data.slice(0, 500);
  }

  try {
    return JSON.parse(JSON.stringify(data));
  } catch {
    return String(data);
  }
}

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
  timeout: 15_000,
});

http.interceptors.request.use((config) => {
  if (!authToken) {
    return config;
  }

  config.headers = config.headers || {};
  config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API] Request failed', {
      method: String(error?.config?.method ?? 'GET').toUpperCase(),
      requestUrl: resolveRequestUrl(error?.config),
      status: error?.response?.status ?? null,
      statusText: error?.response?.statusText ?? '',
      responseData: serializeResponseData(error?.response?.data),
      message: error?.message ?? 'Unknown API error',
    });

    return Promise.reject(error);
  }
);
