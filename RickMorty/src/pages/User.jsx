import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './User.css';
import { useUser } from './UserContext';
const User = () => {
  const {user} = useUser();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const charactersPerPage = 20;
  const charactersPerRow = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [maxId, setMaxId] = useState(1);
  const [characterData, setCharacterData] = useState([]);

  const fetchCharacters = (page) => {
    fetch(`https://rickandmortyapi.com/api/character?page=${page}`)
      .then(response => response.json())
      .then(data => {
        setCharacterData(data.results);
        setCharacters(data.results);
        setMaxId(data.info.pages);
      })
      .catch(error => {
        console.error("Error al llamar a la API:", error);
      });
  };

  useEffect(() => {
    if (user) {
      // Si hay un usuario en el contexto, obtén el personaje según el ID de perfil
      fetch(`https://rickandmortyapi.com/api/character/${user.profile}`)
        .then(response => response.json())
        .then(data => setSelectedCharacter(data))
        .catch(error => {
          console.error("Error al llamar a la API:", error);
        });
    }
  }, [user]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentPage(1);
  };

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
    setModalIsOpen(true);
  };

  useEffect(() => {
    fetchCharacters(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const indexOfLastCharacter = (currentPage + 1) * charactersPerPage;
  const indexOfFirstCharacter = indexOfLastCharacter - charactersPerPage;
  const currentCharacters = characters.slice(indexOfFirstCharacter, indexOfLastCharacter);

  const charactersGrid = [];
  for (let i = 0; i < currentCharacters.length; i += charactersPerRow) {
    charactersGrid.push(currentCharacters.slice(i, i + charactersPerRow));
  }

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
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>  
        <h2>Selecciona un personaje</h2>
        <div>
        {characterData.map(character => (
          <div key={character.id} style={{ marginBottom: 20, marginRight: 20, float: 'left' }}>
            <img src={character.image} alt="Imagen del personaje" onClick={() => handleCharacterClick(character)}/>
          </div>
        ))}
      </div>
      <div>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>Página {currentPage} de {maxId}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === maxId}>
          Siguiente
        </button>
      </div>
      <button onClick={closeModal}>Cerrar</button>
      </Modal>
    </div>
  );
};

export default User;
