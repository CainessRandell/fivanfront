import { debugError, debugLog, sanitizeForLog } from '../utils/debug';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${API_URL}${path}`;
  const startedAt = Date.now();

  debugLog('api', 'Request start', {
    method,
    url,
    headers: sanitizeForLog(headers),
    body
  });

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    const elapsedMs = Date.now() - startedAt;

    if (response.status === 204) {
      debugLog('api', 'Request success (no content)', {
        method,
        url,
        status: response.status,
        elapsedMs
      });

      return null;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      debugError('api', 'Request failed', {
        method,
        url,
        status: response.status,
        elapsedMs,
        response: data
      });

      const error = new Error(data.error || 'Request failed');
      error.status = response.status;
      throw error;
    }

    debugLog('api', 'Request success', {
      method,
      url,
      status: response.status,
      elapsedMs,
      response: data
    });

    return data;
  } catch (error) {
    debugError('api', 'Request crashed', {
      method,
      url,
      message: error.message
    });

    throw error;
  }
}

export const authApi = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload })
};

export const postsApi = {
  list: (token) => request('/posts', { token }),
  create: (payload, token) => request('/posts', { method: 'POST', body: payload, token }),
  update: (id, payload, token) => request(`/posts/${id}`, { method: 'PUT', body: payload, token }),
  remove: (id, token) => request(`/posts/${id}`, { method: 'DELETE', token })
};
