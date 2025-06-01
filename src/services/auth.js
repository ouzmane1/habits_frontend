import api from './api';

export async function login(email, password) {
  const response = await api.post('/login', { email, password });
  localStorage.setItem('access_token', response.data.token);
  localStorage.setItem('refresh_token', response.data.refresh_token);
  return response.data;
}

export async function register(data) {
  return await api.post('/register', data);
}

export async function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

export async function refreshToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  const response = await api.post('/token/refresh', { refresh_token: refreshToken });
  localStorage.setItem('access_token', response.data.token);
  return response.data.token;
}
