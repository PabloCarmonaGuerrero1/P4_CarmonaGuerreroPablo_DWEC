import React, { useState } from 'react';
import '../pages_css/Login.css';
import { useUser } from '../context/UserContext.jsx';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { loginUser } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const userData = JSON.parse(localStorage.getItem(formData.email));

      if (!userData || userData.password !== formData.password) {
        setErrors({
          ...errors,
          email: 'Incorrect email',
          password: 'Incorrect password',
        });
        return;
      }

      console.log('Usuario autenticado:', userData);

      loginUser(userData);

      setFormData({
        email: '',
        password: '',
      });

      navigate('/HomePage');
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
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: name === 'email' ? validateEmail(value) : '',
      password: name === 'password' ? validatePassword(value) : '',
    }));
  };
const handleEmailChange = (e) =>{
  const value = e.target.value
  setFormData({ ...formData, email: value });
  if (!/^\S+@\S+\.\S+$/.test(value)) {
    setErrors((prevErrors) => ({ ...prevErrors, email: 'Please enter a valid email address.' }));
  } else {
    setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
  }
}
  const validateEmail = (email) => {
    return email ? '' : 'Email Required';
  };

  const validatePassword = (password) => {
    return password ? '' : 'Password Required';
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
            onChange={handleEmailChange}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </label>
        <br />
        <label>
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </label>
        <br />
        <button type="submit">Login</button>
        <button onClick={() => navigate('/Register')}>Register</button>
      </form>
    </div>
  );
};

export default LoginForm;
