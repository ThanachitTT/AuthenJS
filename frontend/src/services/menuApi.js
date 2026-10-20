import axios from 'axios';
import { authHeader } from './authHeader';
const API_URL = 'http://localhost:5000/api/menu';

export const menuApi = {
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },
  create: async (data) => {
    const response = await axios.post(API_URL, data, authHeader());
    return response.data;
  },
  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, authHeader());
    return response.data;
  },
  rate: async (menuId, score) => {
    const response = await axios.post(
      `http://localhost:5000/api/rating/${menuId}`, { score }, authHeader());
    return response.data;
  },
};
