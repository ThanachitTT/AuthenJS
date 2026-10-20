import axios from 'axios';
const API_URL = 'http://localhost:5000/api/type';

export const typeApi = {
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },
};
