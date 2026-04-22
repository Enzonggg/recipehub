import { apiRequest, createAuthHeaders } from './apiClient.js'

export async function loginApi({ role, identifier, password }) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ role, identifier, password }),
  })
}

export async function registerCustomerApi({ fullName, email, password }) {
  return apiRequest('/api/auth/register/customer', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password }),
  })
}

export async function registerStaffApi({ fullName, email, password }) {
  return apiRequest('/api/auth/register/staff', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password }),
  })
}

export async function getMeApi(token) {
  return apiRequest('/api/auth/me', {
    method: 'GET',
    headers: createAuthHeaders(token),
  })
}

export async function updateMyProfileApi(token, { fullName, email }) {
  return apiRequest('/api/auth/me', {
    method: 'PATCH',
    headers: createAuthHeaders(token),
    body: JSON.stringify({ fullName, email }),
  })
}

export async function updateMyPasswordApi(token, { currentPassword, newPassword }) {
  return apiRequest('/api/auth/password', {
    method: 'PATCH',
    headers: createAuthHeaders(token),
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}

export async function createStaffApi(token, { fullName, email, password }) {
  return apiRequest('/api/admin/staff', {
    method: 'POST',
    headers: createAuthHeaders(token),
    body: JSON.stringify({ fullName, email, password }),
  })
}

export async function listStaffApi(token) {
  return apiRequest('/api/admin/staff', {
    method: 'GET',
    headers: createAuthHeaders(token),
  })
}

export async function updateStaffApi(token, staffId, payload) {
  return apiRequest(`/api/admin/staff/${staffId}`, {
    method: 'PATCH',
    headers: createAuthHeaders(token),
    body: JSON.stringify(payload),
  })
}

export async function deleteStaffApi(token, staffId) {
  return apiRequest(`/api/admin/staff/${staffId}`, {
    method: 'DELETE',
    headers: createAuthHeaders(token),
  })
}
