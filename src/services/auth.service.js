import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

class AuthService {
  constructor() {
    // Configuration des intercepteurs axios
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

    // Intercepteur pour gérer les erreurs 401 et le refresh token
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Si l'erreur est 401 et qu'on n'a pas déjà tenté de rafraîchir le token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?.refreshToken) {
              throw new Error('No refresh token available');
            }

            // Appel à l'API pour rafraîchir le token
            const response = await axios.post(`${API_URL}/token/refresh`, {
              refresh_token: user.refreshToken
            });

            const { token } = response.data;

            // Mise à jour du token dans le localStorage
            user.token = token;
            localStorage.setItem('user', JSON.stringify(user));

            // Mise à jour du header de la requête originale
            originalRequest.headers['Authorization'] = `Bearer ${token}`;

            // Réessayer la requête originale
            return axios(originalRequest);
          } catch (refreshError) {
            // Si le refresh échoue, on déconnecte l'utilisateur
            this.logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async login(email, password) {
    try {
      if (!email || !password) {
        throw new Error('Email et mot de passe requis');
      }

      const response = await axios.post(`${API_URL}/login_check`, {
        email: email.trim(),
        password: password
      });

      const { token, refresh_token } = response.data;

      // Stockage des informations utilisateur
      const user = {
        token,
        refreshToken: refresh_token,
        email: email
      };
      localStorage.setItem('user', JSON.stringify(user));

      return response.data;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      // Essayer d'extraire un message d'erreur plus spécifique du backend
      const errorMessage = error.response?.data?.detail || error.message || 'Erreur inconnue lors de la connexion';
      throw new Error(errorMessage);
    }
  }

  async register(email, password, name) {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email: email.trim(),
        password: password,
        name: name.trim()
      });

      return response.data;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      // Relaye l'erreur complète pour traitement côté frontend
      throw error; // <-- c'est tout !
    }
  }

  logout() {
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    const user = JSON.parse(localStorage.getItem('user'));
    return !!user?.token;
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
  
  async getUserInfo() {
    try {
      const response = await axios.get(`${API_URL}/me`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des infos utilisateur');
    }
  }
}

export default new AuthService(); 