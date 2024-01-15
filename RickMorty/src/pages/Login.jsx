import React, { useState } from 'react';
import { openDB } from 'idb'; 
import { DBConfig } from '../DataBase/DBConfig';
import "./Login.css"
import { useUser } from "./UserContext.jsx"
import { useNavigate } from 'react-router-dom';

const openDatabase = () => {
  return openDB(DBConfig.name, DBConfig.version, {
    upgrade(db) {
      const store = db.createObjectStore(DBConfig.objectStoresMeta[0].store, { keyPath: 'email' });

      DBConfig.objectStoresMeta[0].storeSchema.forEach((index) => {
        store.createIndex(index.name, index.keypath, index.options);
      });
    },
  });
};

const LoginForm = () => {
  const { loginUser } = useUser(); 
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const db = await openDatabase();
      const transaction = db.transaction(DBConfig.objectStoresMeta[0].store, 'readonly');
      const store = transaction.objectStore(DBConfig.objectStoresMeta[0].store);
  
      const request = store.index('email').get(formData.email);
      const result = await request;
  
      if (!result || result.password !== formData.password) {
        console.error('Credenciales inválidas');
        return;
      }
  
      console.log('Usuario autenticado:', result);
  
      loginUser(result);
  
      setTimeout(() => {
        setFormData({
          email: '',
          password: '',
        });
        navigate('/homepage');
      }, 500); 
    } catch (error) {
      console.error('Error al autenticar el usuario', error);
    }
  };
  
  return (
    <div className='login-container'>
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
