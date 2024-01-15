import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './User.css';
import { useUser } from './UserContext';
import { openDB } from 'idb'; // Importa openDB de la librería idb

const User = () => {
  const { user } = useUser();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [characterData, setCharacterData] = useState([]);
  const [db, setDb] = useState(null);
  const dbName = 'MyDB';

  useEffect(() => {
    const fetchCharacters = async (page) => {
      try {
        const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
        const data = await response.json();
        setCharacterData(data.results);
      } catch (error) {
        console.error("Error al llamar a la API:", error);
      }
    };

    fetchCharacters(1);

    const initializeDB = async () => {
      const db = await openDB(dbName, 1, {
        upgrade(db) {
          const store = db.createObjectStore('Users', {
            keyPath: 'email',
          });
          store.createIndex('profileIndex', 'profile');
        },
      });

      setDb(db);
    };

    initializeDB();
  }, []);

  const handleCharacterClick = async (character) => {
    setModalIsOpen(true);

    if (db) {
      const transaction = db.transaction('Users', 'readwrite');
      const store = transaction.objectStore('Users');

      const existingUser = await store.get(user.email);

      if (existingUser) {
        existingUser.profile = character.id;
        store.put(existingUser);
      }
    }
  };

  return (
    <div className="user-container">
      <h1>Perfil de usuario</h1>
      {user && (
        <>
          <img
            src={`https://rickandmortyapi.com/api/character/avatar/${user.profile}.jpeg`}
            alt={user.profileName || user.name}
            onClick={() => handleCharacterClick(user)}
          />
          <p>{user.name}</p>
        </>
      )}
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <h2>Selecciona un personaje</h2>
        <div>
          {characterData.map((character) => (
            <div key={character.id} style={{ marginBottom: 20, marginRight: 20, float: 'left' }}>
              <img src={character.image} alt="Imagen del personaje" onClick={() => handleCharacterClick(character)} />
            </div>
          ))}
        </div>
        <button onClick={() => setModalIsOpen(false)}>Cerrar</button>
      </Modal>
    </div>
  );
};

export default User;
