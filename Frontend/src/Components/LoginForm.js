import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';

const LoginForm = ({ onClose }) => {
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ login: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(credentials.login, credentials.password)) {
      onClose();
    } else {
      setError('Invalid login or password!');
    }
  };

  return (
    <div className="auth-form">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Login"
          value={credentials.login}
          onChange={(e) => setCredentials({ ...credentials, login: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;