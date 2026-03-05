import { clearAuthToken, http, setAuthToken } from './httpClient.js';

const TOKEN_STORAGE_KEY = 'menu_admin_token';

function unwrap(response) {
  const payload = response?.data;
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  return payload.data ?? payload;
}

export function restoreAdminToken() {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    setAuthToken(token);
  }
  return token;
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  clearAuthToken();
}

export async function adminLogin(email, password) {
  const response = await http.post('/api/v1/admin/login', { email, password });
  const data = unwrap(response);
  if (data?.token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    setAuthToken(data.token);
  }
  return data;
}

export async function tenantAdminLogin(email, password) {
  return adminLogin(email, password);
}

export async function fetchAdminSession() {
  const response = await http.get('/api/v1/admin/session');
  return unwrap(response);
}

export async function fetchMyDashboard() {
  const response = await http.get('/api/v1/admin/me/dashboard');
  return unwrap(response);
}

export async function fetchTenants() {
  const response = await http.get('/api/v1/admin/tenants');
  return unwrap(response) ?? [];
}

export async function createTenant(body) {
  const response = await http.post('/api/v1/tenants', body);
  return unwrap(response);
}

export async function fetchTenantDashboard(tenantId) {
  const response = await http.get(`/api/v1/admin/tenants/${tenantId}/dashboard`);
  return unwrap(response);
}

export async function fetchTenantAdmins(tenantId) {
  const response = await http.get(`/api/v1/admin/tenants/${tenantId}/admin-users`);
  return unwrap(response) ?? [];
}

export async function createTenantAdmin(tenantId, body) {
  const response = await http.post(`/api/v1/admin/tenants/${tenantId}/admin-users`, body);
  return unwrap(response);
}

export async function updateTenantAdmin(tenantId, adminUserId, body) {
  const response = await http.patch(
    `/api/v1/admin/tenants/${tenantId}/admin-users/${adminUserId}`,
    body
  );
  return unwrap(response);
}

export async function deleteTenantAdmin(tenantId, adminUserId) {
  const response = await http.delete(`/api/v1/admin/tenants/${tenantId}/admin-users/${adminUserId}`);
  return unwrap(response);
}

export async function createMenu(tenantId, body) {
  const response = await http.post(`/api/v1/admin/tenants/${tenantId}/menus`, body);
  return unwrap(response);
}

export async function updateMenu(tenantId, menuId, body) {
  const response = await http.patch(`/api/v1/admin/tenants/${tenantId}/menus/${menuId}`, body);
  return unwrap(response);
}

export async function archiveMenu(tenantId, menuId) {
  const response = await http.delete(`/api/v1/admin/tenants/${tenantId}/menus/${menuId}`);
  return unwrap(response);
}

export async function createCategory(tenantId, body) {
  const response = await http.post(`/api/v1/admin/tenants/${tenantId}/categories`, body);
  return unwrap(response);
}

export async function updateCategory(tenantId, categoryId, body) {
  const response = await http.patch(`/api/v1/admin/tenants/${tenantId}/categories/${categoryId}`, body);
  return unwrap(response);
}

export async function archiveCategory(tenantId, categoryId) {
  const response = await http.delete(`/api/v1/admin/tenants/${tenantId}/categories/${categoryId}`);
  return unwrap(response);
}

export async function createItem(tenantId, body) {
  const response = await http.post(`/api/v1/admin/tenants/${tenantId}/items`, body);
  return unwrap(response);
}

export async function updateItem(tenantId, itemId, body) {
  const response = await http.patch(`/api/v1/admin/tenants/${tenantId}/items/${itemId}`, body);
  return unwrap(response);
}

export async function archiveItem(tenantId, itemId) {
  const response = await http.delete(`/api/v1/admin/tenants/${tenantId}/items/${itemId}`);
  return unwrap(response);
}

export async function updateSiteContent(tenantId, body) {
  const response = await http.patch(`/api/v1/admin/tenants/${tenantId}/site-content`, body);
  return unwrap(response);
}
