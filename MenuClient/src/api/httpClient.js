import axios from 'axios';

const envBase =
  typeof import.meta.env?.VITE_API_BASE_URL === 'string'
    ? import.meta.env.VITE_API_BASE_URL.trim()
    : '';

const baseURL = envBase || 'http://localhost:3000';

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
