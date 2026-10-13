import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure Axios defaults
axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up token authorization header if stored
  const applyToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('pokeflix_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('pokeflix_token');
    }
  };

  // Fetch initial user from GET /api/auth/me on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('pokeflix_token');
      if (storedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }

      try {
        const response = await axios.get('/api/auth/me');
        if (response.data && (response.data.user || response.data)) {
          setUser(response.data.user || response.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        // Fallback: check if local mock session exists for seamless preview
        const storedUser = localStorage.getItem('pokeflix_user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const userData = response.data.user || response.data;
      const token = response.data.token;
      
      if (token) applyToken(token);
      localStorage.setItem('pokeflix_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/auth/register', { username, email, password });
      const userData = response.data.user || response.data;
      const token = response.data.token;

      if (token) applyToken(token);
      localStorage.setItem('pokeflix_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Demo / Guest login for testing without backend running
  const demoLogin = (role = 'Ash Ketchum') => {
    const demoUser = {
      id: 'demo-trainer-1',
      username: role,
      email: 'ash@pokeflix.tv',
      avatar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
      badge: 'Pokémon Master',
    };
    localStorage.setItem('pokeflix_user', JSON.stringify(demoUser));
    setUser(demoUser);
    setError(null);
    return demoUser;
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      applyToken(null);
      localStorage.removeItem('pokeflix_user');
      setUser(null);
      setError(null);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    demoLogin,
    logout,
    clearError,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
