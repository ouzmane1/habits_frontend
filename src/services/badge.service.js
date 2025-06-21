import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

class BadgeService {
  constructor() {
    // Configuration des intercepteurs axios (hérite de la configuration auth)
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

  async getAllBadges() {
    try {
      const response = await axios.get(`${API_URL}/badges`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des badges:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Erreur lors de la récupération des badges';
      throw new Error(errorMessage);
    }
  }

  async getBadgeById(id) {
    try {
      const response = await axios.get(`${API_URL}/badges/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du badge ${id}:`, error);
      const errorMessage = error.response?.data?.detail || error.message || `Erreur lors de la récupération du badge ${id}`;
      throw new Error(errorMessage);
    }
  }

  async getUserBadges() {
    try {
      const response = await axios.get(`${API_URL}/badges/user`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des badges utilisateur:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Erreur lors de la récupération des badges utilisateur';
      throw new Error(errorMessage);
    }
  }
}

export default new BadgeService(); 