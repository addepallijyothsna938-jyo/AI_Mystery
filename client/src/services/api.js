import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1', timeout: 90000, withCredentials: true });
export const apiReady = () => import.meta.env.VITE_DEMO_MODE !== 'true';
export async function generateMystery(payload) {
  const { data } = await api.post('/mysteries', payload);
  return data.data;
}
export async function fetchMystery(id) {
  const { data } = await api.get(`/mysteries/${id}`);
  return data.data;
}
export async function discoverEvidence(investigationId, evidenceId) {
  const { data } = await api.post(`/investigations/${investigationId}/discoveries`, { evidenceId });
  return data.data;
}
export async function accuse(investigationId, suspectId) {
  const { data } = await api.post(`/investigations/${investigationId}/accusation`, { suspectId });
  return data.data;
}
export async function listCases() {
  const { data } = await api.get('/mysteries');
  return data.data;
}
export function getApiError(error) {
  return error?.response?.data?.error?.message || 'The archive could not be reached. Your case is still safe here.';
}
