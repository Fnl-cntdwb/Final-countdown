import React, { createContext, useContext, useState } from 'react';
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const register = async (username, password) => {
    try {
      const response = await axios.post('/users/register', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post('/users/login', {
        username,
        password,
      });
      setCurrentUser(response.data);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);