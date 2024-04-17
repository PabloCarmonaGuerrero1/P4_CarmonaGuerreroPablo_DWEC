import React, { useState } from 'react';
import '../pages_css/Register.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    favourite: [],
    profile: 1,
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (formData.username.trim() === '') {
        setErrors((prevErrors) => ({ ...prevErrors, username: 'Please enter a username.' }));
        throw new Error('Please enter a username.');
      }
      if (formData.email.trim() === '') {
        setErrors((prevErrors) => ({ ...prevErrors, email: 'Please enter an email.' }));
        throw new Error('Please enter an email.');
      }
      if (formData.password.length < 6) {
        setErrors((prevErrors) => ({ ...prevErrors, password: 'Please enter a password.' }));
        throw new Error('Please enter a password.');
      }

      const existingUser = localStorage.getItem(formData.email);
      if (existingUser) {
        throw new Error('This email is already registered.');
      }

      const userData = {
        name: formData.username,
        email: formData.email,
        password: formData.password,
        favourite: formData.favourite || [],
        profile: formData.profile || 1,
      };

      localStorage.setItem(formData.email, JSON.stringify(userData));

      console.log('Usuario registrado con éxito');

      setFormData({
        username: '',
        email: '',
        password: '',
        favourite: [],
        profile: 1,
      });
      navigate('/');
    } catch (error) {
      if (error.message === 'This email is already registered.') {
        setErrors((prevErrors) => ({ ...prevErrors, email: error.message }));
      }
    }
  };

  const handleNickNameChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, username: value });
    if (value.trim() === '') {
      setErrors((prevErrors) => ({ ...prevErrors, username: 'Please enter a username.' }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, username: '' }));
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, email: value });
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setErrors((prevErrors) => ({ ...prevErrors, email: 'Please enter a valid email address.' }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, password: value });
    if (value.length < 6) {
      setErrors((prevErrors) => ({ ...prevErrors, password: 'Password must be at least 6 characters long.' }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
    }
  };

  const handleInputFocus = (fieldName) => {
    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: '' }));
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        <label>
          Nickname
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleNickNameChange}
            onFocus={() => handleInputFocus('username')}
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </label>
        <br />
        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleEmailChange}
            onFocus={() => handleInputFocus('email')}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </label>
        <br />
        <label>
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handlePasswordChange}
            onFocus={() => handleInputFocus('password')}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
