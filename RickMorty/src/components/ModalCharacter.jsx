import React from 'react';
import Modal from 'react-modal';

const CharacterModal = ({ isOpen, onRequestClose, character, onFavoriteClick, setUserFavorites, userFavorites }) => {
  return (
    <Modal className="modal" isOpen={isOpen} onRequestClose={onRequestClose}>
      {character && (
        <>
          <h2>{character.name}</h2>
          <img src={character.image} alt="Character Image" />
          <p>Status: {character.status}</p>
          <p>Species: {character.species}</p>
          <p>Gender: {character.gender}</p>
          <p>Origin: {character.origin.name}</p>
          <p>Location: {character.location.name}</p>
          <button onClick={() => onFavoriteClick(character)}>
            {userFavorites.includes(character.id) ? 'UNFAV' : 'FAV'}
          </button>
          <button onClick={onRequestClose}>Close</button>
        </>
      )}
    </Modal>
  );
};

export default CharacterModal;
