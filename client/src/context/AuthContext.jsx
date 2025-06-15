import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to set token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  async function login(email, password) {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setAuthToken(token);
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function signup(email, password, name = '') {
    try {
      const response = await axios.post('/api/auth/register', { email, password, name });
      // Auto-login after successful signup
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setAuthToken(token);
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    localStorage.removeItem('token');
    setAuthToken(null);
    setCurrentUser(null);
  }

  useEffect(() => {
    // On mount, check for token and fetch user profile
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      axios.get('/api/users/me')
        .then((response) => {
          setCurrentUser(response.data);
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 