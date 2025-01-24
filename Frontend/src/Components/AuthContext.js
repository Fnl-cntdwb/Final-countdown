import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const register = async (username, password) => {
    try {
      const json = JSON.stringify({username:username,password:password})
      const response = await axios.post('http://localhost:8080/user/register', json, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Registration error:', {
        message: error.message,
        response: error.response?.data,
      });
      return { error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8080/user/login', null, { params: {
        username,
        password,
      }});
      if (response.status !== 200) {
        console.error('Login failed: Status not OK');
        return { error: 'Invalid credentials' };
      }
      localStorage.setItem('authToken', response.data.token);
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
      });
      return { error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setCurrentUser({ token }); // Adjust according to your structure
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);