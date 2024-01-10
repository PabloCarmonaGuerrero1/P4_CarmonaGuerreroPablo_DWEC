import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './User.css';
import Pagination from 'react-paginate';

const User = () => {
  const [user, setUser] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const charactersPerPage = 20;

  useEffect(() => {
    fetch('https://rickandmortyapi.com/api/character/1')
      .then(response => response.json())
      .then(data => setUser(data));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch('https://rickandmortyapi.com/api/character')
      .then(response => response.json())
      .then(data => setCharacters(data.results));
  }, [user]);

  const openModal = () => setModalIsOpen(true);

  const closeModal = () => setModalIsOpen(false);

  const indexOfLastCharacter = (currentPage + 1) * charactersPerPage;
  const indexOfFirstCharacter = indexOfLastCharacter - charactersPerPage;
  const currentCharacters = characters.slice(indexOfFirstCharacter, indexOfLastCharacter);

  const handleCharacterClick = (character) => setSelectedCharacter(character);

  return (
    <div>
      <h1>Perfil de usuario</h1>
      {user ? (
        <>
          <img src={selectedCharacter ? selectedCharacter.image : user.image} alt={user.name} onClick={openModal} />
          <p>{user.name}</p>
        </>
      ) : (
        <p>Cargando perfil de usuario...</p>
      )}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="Modal" overlayClassName="Overlay">
        <h2>Selecciona un personaje</h2>
        <ul className="characters-grid">
          {currentCharacters.map((character, index) => (
            <li key={index} onClick={() => handleCharacterClick(character)}>
              <img src={character.image} alt={character.name} />
              <p>{character.name}</p>
            </li>
          ))}
        </ul>
        <Pagination
          previousLabel={'Anterior'}
          nextLabel={'Siguiente'}
          breakLabel={'...'}
          pageCount={Math.ceil(characters.length / charactersPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={(data) => setCurrentPage(data.selected)}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />
        <button onClick={closeModal}>Cerrar</button>
      </Modal>
    </div>
  );
};

export default User;