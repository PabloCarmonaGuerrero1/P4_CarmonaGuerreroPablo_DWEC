import React, { useState, useEffect } from "react";
import "./HomePage.css";
import Modal from 'react-modal';

const HomePage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [maxId, setMaxId] = useState(1);
    const [characterData, setCharacterData] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [searchName, setSearchName] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
  
  
    const fetchCharacters = (page, status, name) => {
      let url = `https://rickandmortyapi.com/api/character?page=${page}`;
  
  
      if (status !== "all") {
        url += `&status=${status}`;
      }
  
  
      if (name.trim() !== "") {
        url += `&name=${name}`;
      }
  
  
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error en la llamada a la API: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.results && data.results.length > 0) {
            setCharacterData(data.results);
            setMaxId(data.info.pages);
          } else {
            setCharacterData([]);
            setMaxId(1);
          }
        })
        .catch((error) => {
          console.error("Error al llamar a la API:", error);
          setCharacterData([]);
          setMaxId(1);
        });
    };
  
  
    useEffect(() => {
      fetchCharacters(currentPage, selectedStatus, searchName);
    }, [currentPage, selectedStatus, searchName]);
  
  
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };
  
  
    const handleStatusChange = (e) => {
      setSelectedStatus(e.target.value);
    };
  
  
    const handleSearchChange = (e) => {
      setSearchName(e.target.value);
    };
  
  
    const openModal = (character) => {
      setSelectedCharacter(character);
      setModalIsOpen(true);
    };
  
  
    const closeModal = () => {
      setSelectedCharacter(null);
      setModalIsOpen(false);
    };
  
  
    return (
      <div className="home-page-container">
        <div className="header">
          <h1>Home</h1>
        </div>
        <form className="filter-form">
          <label>
            Status:
            <select value={selectedStatus} onChange={handleStatusChange}>
              <option value="all">All</option>
              <option value="alive">Alive</option>
              <option value="dead">Dead</option>
              <option value="unknown">Unknown</option>
            </select>
          </label>
          <label>
            Name:
            <input
              type="text"
              value={searchName}
              onChange={handleSearchChange}
            />
          </label>
        </form>
        <div className="character-container">
          {characterData.length > 0 ? (
            characterData.map((character) => (
              <div key={character.id} className="character-card" onClick={() => openModal(character)}>
                <img src={character.image} alt="Imagen del personaje" />
                <p>{character.name}</p>
              </div>
            ))
          ) : (
            <p>No se encontraron resultados para "{searchName}".</p>
          )}
        </div>
        <Modal className="modal" isOpen={modalIsOpen} onRequestClose={closeModal}>
          {selectedCharacter && (
            <>
              <h2>{selectedCharacter.name}</h2>
              <img src={selectedCharacter.image} alt="Imagen del personaje" />
              <p>Status: {selectedCharacter.status}</p>
              <p>Species: {selectedCharacter.species}</p>
              <p>Gender: {selectedCharacter.gender}</p>
              <p>Origin: {selectedCharacter.origin.name}</p>
              <p>Location: {selectedCharacter.location.name}</p>
            </>
          )}
          <button onClick={closeModal}>Cerrar</button>
        </Modal>
        <div className="footer">
          <div className="pagination-container">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span>Página {currentPage} de {maxId}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === maxId}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    );
  };
  

export default HomePage