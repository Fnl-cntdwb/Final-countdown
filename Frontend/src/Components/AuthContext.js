import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState([{ login: 'admin', password: 'admin' }]);
  const [currentUser, setCurrentUser] = useState(null); // Store the logged in user

  const register = (login, password) => {
    setUsers([...users, { login, password }]);
  };

  const login = (login, password) => {
    const user = users.find((u) => u.login === login && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ users, currentUser, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;