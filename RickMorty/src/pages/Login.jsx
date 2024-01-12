import React, { useState } from 'react';
import { openDB } from 'idb'; 
import { DBConfig } from '../DataBase/DBConfig';
import "./Login.css"

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
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

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

     
      setFormData({
        email: '',
        password: '',
      });

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
    </form>
    </div>
  );
};

export default LoginForm;