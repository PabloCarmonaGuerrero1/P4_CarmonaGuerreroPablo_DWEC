import React, { useState } from 'react';
import './Login.css';
import { useUser } from './UserContext.jsx';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { loginUser } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleSubmit = () => {
    try {
      const userData = JSON.parse(localStorage.getItem(formData.email));

      if (!userData || userData.password !== formData.password) {
        console.error('Credenciales inválidas');
        return;
      }

      console.log('Usuario autenticado:', userData);

      loginUser(userData);

      setFormData({
        email: '',
        password: '',
      });

      navigate('/homepage');
    } catch (error) {
      console.error('Error al autenticar el usuario', error);
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
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
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
        <button type="submit">Login</button>
        <button onClick={() => navigate('/Register')}>Register</button>
      </form>
    </div>
  );
};

export default LoginForm;
