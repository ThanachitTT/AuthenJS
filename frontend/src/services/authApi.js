import axios from 'axios';
import { authHeader } from './authHeader';
const API_URL = 'http://localhost:5000/api/authen';

export const authApi = {
  register: (inputs) => axios.post(`${API_URL}/register`, inputs),
  login: (inputs) => axios.post(`${API_URL}/login`, inputs),
  home: () => axios.get(`${API_URL}/home`, authHeader()),
  getUsers: async () => {
    const response = await axios.get(`${API_URL}/users`, authHeader());
    return response.data;
  },
  setRole: (id, role) => axios.put(`${API_URL}/users/${id}/role`, { role }, authHeader()),
};
