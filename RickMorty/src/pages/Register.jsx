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

  const navigate = useNavigate();

  const handleSubmit = () => {
    try {
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
      })
      navigate('/')
    } catch (error) {
      console.error('Error al registrar el usuario', error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
