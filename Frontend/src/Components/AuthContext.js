import React, { createContext, useContext, useState } from 'react';
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const register = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8080/user/register', {
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
      const response = await axios.post('http://localhost:8080/user/login', {
        username,
        password,
      });
      if (response.status !== 200) {
        console.error('Login failed: Status not OK');
        return null;
      }
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      return null;
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