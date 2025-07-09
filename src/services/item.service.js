import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

class ItemService {
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

  async createHabit(data) {
    try {
      const response = await axios.post(`${API_URL}/create/habits`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de l'habitude:", error.response?.data || error.message);
      throw error;
    }
  }

  async createObjective(data) {
    try {
      const response = await axios.post(`${API_URL}/create/objective`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de l'objectif:", error.response?.data || error.message);
      throw error;
    }
  }

  async updateHabit(id, data) {
    try {
      const response = await axios.put(`${API_URL}/habits/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'habitude:", error.response?.data || error.message);
      throw error;
    }
  }

  async updateObjective(id, data) {
    try {
      const response = await axios.put(`${API_URL}/objectives/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'objectif:", error.response?.data || error.message);
      throw error;
    }
  }

  async deleteHabit(id) {
    try {
      const response = await axios.delete(`${API_URL}/habits/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'habitude:", error.response?.data || error.message);
      throw error;
    }
  }

  async deleteObjective(id) {
    try {
      const response = await axios.delete(`${API_URL}/objectives/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'objectif:", error.response?.data || error.message);
      throw error;
    }
  }

  async getHabits() {
    try {
      const response = await axios.get(`${API_URL}/habits`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des habitudes:', error);
      throw error;
    }
  }

  async getObjectives() {
    try {
      const response = await axios.get(`${API_URL}/objectives`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des objectifs:', error);
      throw error;
    }
  }

  async getTodaytask() {
    try {
      const response = await axios.get(`${API_URL}/today/tasks`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des taches d'aujourd'hui ", error);
      throw error;
    }
  }

  async logTaskDay(type, id) {
    try {
      const response = await axios.post(`${API_URL}/tasks/${type}/${id}/log-day`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du log de la tâche:", error.response?.data || error.message);
      throw error;
    }
  }

  async deleteTaskLog(type, id) {
    try {
      const response = await axios.delete(`${API_URL}/tasks/${type}/${id}/log-day`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression du log de la tâche:", error.response?.data || error.message);
      throw error;
    }
  }

  async getCompletedtask() {
    try {
      const response = await axios.get(`${API_URL}/user/completed-tasks`);
      return response.data;
    } catch (error) {
      console.log("Erreur lors de la récupération des taches complétées: ", error);
      throw error;
    }
  }
}

export default new ItemService(); 
