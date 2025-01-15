import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';

const SignupForm = ({ onClose }) => {
  const { register, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ login: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const validatePassword = (password) => {
    const hasEightChars = /.{8,}/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasEightChars && hasUppercase && hasNumber;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters, 1 uppercase letter, and 1 number');
      return;
    }

    register(formData.login, formData.password);
    login(formData.login, formData.password);
    onClose();
  };

  return (
    <div className="auth-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Login"
          value={formData.login}
          onChange={(e) => setFormData({ ...formData, login: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupForm;