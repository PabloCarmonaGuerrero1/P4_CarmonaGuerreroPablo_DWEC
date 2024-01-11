import React, { useState } from 'react';
import { openDB } from 'idb'; 
import { DBConfig } from '../DataBase/DBConfig';

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

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
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
      const transaction = db.transaction(DBConfig.objectStoresMeta[0].store, 'readwrite');
      const store = transaction.objectStore(DBConfig.objectStoresMeta[0].store);

      const userData = {
        name: formData.username,
        email: formData.email,
        password: formData.password,
      };

      await store.add(userData);
      console.log('Usuario registrado con éxito');
    } catch (error) {
      console.error('Error al registrar el usuario', error);
    }
  };

  return (
    <div>
      <h1>Registro</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Usuario:
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
          Correo Electrónico:
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
          Contraseña:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
