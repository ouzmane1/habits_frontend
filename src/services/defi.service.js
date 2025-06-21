import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

class DefiService {
  constructor() {
    axios.interceptors.request.use(
      (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.token) {
          config.headers['Authorization'] = `Bearer ${user.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async getDefis() {
    try {
      const response = await axios.get(`${API_URL}/defi`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des défis:', error);
      throw error;
    }
  }

  async getDefi(id) {
    try {
      const response = await axios.get(`${API_URL}/defi/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du défi:', error);
      throw error;
    }
  }

  async createDefi(data) {
    try {
      const response = await axios.post(`${API_URL}/defi`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du défi:", error.response?.data || error.message);
      throw error;
    }
  }

  async updateDefi(id, data) {
    try {
      const response = await axios.put(`${API_URL}/defi/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du défi:", error.response?.data || error.message);
      throw error;
    }
  }

  async deleteDefi(id) {
    try {
      const response = await axios.delete(`${API_URL}/defi/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression du défi:", error.response?.data || error.message);
      throw error;
    }
  }
}

export default new DefiService(); 