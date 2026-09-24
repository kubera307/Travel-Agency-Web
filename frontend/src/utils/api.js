/**
 * Centralized API Client with Token Interception, Error Standardization & Session Security
 */

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
  : '/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('nammayatra_token') || localStorage.getItem('travel_india_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {})
  };

  const config = {
    method: options.method || 'GET',
    headers,
    ...(options.body && { body: JSON.stringify(options.body) })
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      // Automatic session cleanup on 401 Unauthorized for authenticated endpoints
      if (res.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
        localStorage.removeItem('travel_india_token');
        window.dispatchEvent(
          new CustomEvent('auth:session_expired', {
            detail: data.message || 'Session expired. Please sign in again.'
          })
        );
      }

      const error = new Error(data.message || 'API request failed');
      error.status = res.status;
      error.code = data.code;
      error.errors = data.errors || [];
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to NammaYatra API server. Please check your network or server status.');
    }
    throw err;
  }
}

export const api = {
  get: (endpoint, options) => apiRequest(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => apiRequest(endpoint, { method: 'POST', body, ...options }),
  put: (endpoint, body, options) => apiRequest(endpoint, { method: 'PUT', body, ...options }),
  delete: (endpoint, options) => apiRequest(endpoint, { method: 'DELETE', ...options })
};
