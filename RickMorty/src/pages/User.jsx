import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './User.css';
import { useUser } from './UserContext';
import { openDB } from 'idb';

const User = () => {
  const { user, loginUser } = useUser();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [characterData, setCharacterData] = useState([]);
  const [db, setDb] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxID, setMaxID] = useState(1); 

  useEffect(() => {
    const fetchCharacters = async (page) => {
      try {
        const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
        const data = await response.json();

        setCharacterData(data.results);
        setMaxID(data.info.pages); 

      } catch (error) {
        console.error("Error al llamar a la API:", error);
      }
    };

    fetchCharacters(currentPage);

    const initializeDB = async () => {
      const db = await openDB(DBConfig.name, DBConfig.version);
      setDb(db);
    };

    initializeDB();
  }, [currentPage]);

  const handleCharacterClick = async (character) => {
    setModalIsOpen(true);

    try {

      const updatedUser = { ...user, profile: character.id };
      loginUser(updatedUser);


      localStorage.setItem(user.email, JSON.stringify(updatedUser));

      if (db) {
        const transaction = db.transaction(DBConfig.objectStoresMeta[0].store, 'readwrite');
        const store = transaction.objectStore(DBConfig.objectStoresMeta[0].store);

        const existingUser = await store.get(user.email);

        if (existingUser) {
          existingUser.profile = character.id;
          store.put(existingUser);
        }
      }
    } catch (error) {
      console.error('Error al actualizar el perfil del usuario en la base de datos', error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="user-container">
      <h1>Perfil de usuario</h1>
      {user && (
        <>
          <img
            src={`https://rickandmortyapi.com/api/character/avatar/${user.profile}.jpeg`}
            alt={user.profileName || user.name}
            onClick={() => setModalIsOpen(true)}
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
        <div className="pagination-container">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Anterior
          </button>
          <span>Página {currentPage}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === maxID}>
            Siguiente
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default User;
