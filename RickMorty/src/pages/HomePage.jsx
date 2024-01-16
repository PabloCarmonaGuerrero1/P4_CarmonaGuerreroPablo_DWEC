import React, { useState, useEffect } from "react";
import '../pages_css/HomePage.css';
import Modal from 'react-modal';
import { useUser } from "../context/UserContext";
import { DBConfig } from "../DataBase/DBConfig";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { user, loginUser } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [maxId, setMaxId] = useState(1);
  const [characterData, setCharacterData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchName, setSearchName] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [userFavorites, setUserFavorites] = useState(user ? user.favourite || [] : []);
  const [db, setDb] = useState(null);
  const [resetPage, setResetPage] = useState(false);

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
    if (resetPage) {
      setCurrentPage(1);
      setResetPage(false);
    }
    fetchCharacters(currentPage, selectedStatus, searchName);
  }, [currentPage, selectedStatus, searchName]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setResetPage(true);
  };

  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
    setResetPage(true);
  };

  const openModal = (character) => {
    setSelectedCharacter(character);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedCharacter(null);
    setModalIsOpen(false);
  };

  const handleFavoriteClick = async (character) => {
    const isFavorite = userFavorites.includes(character.id);
  
    try {
      setUserFavorites((prevFavorites) => {
        const updatedFavorites = isFavorite
          ? prevFavorites.filter((id) => id !== character.id)
          : [...prevFavorites, character.id];
  
        const updatedUser = { ...user, favourite: updatedFavorites };
        loginUser(updatedUser);
        localStorage.setItem(user.email, JSON.stringify(updatedUser));

        if (db) {
          const updateDatabase = async () => {
            const transaction = db.transaction(DBConfig.objectStoresMeta[0].store, 'readwrite');
            const store = transaction.objectStore(DBConfig.objectStoresMeta[0].store);
  
            const existingUser = await store.get(user.email);
  
            if (existingUser) {
              existingUser.favourite = updatedFavorites;
              store.put(existingUser);
            }
          };
  
          updateDatabase();
        }
  
        return updatedFavorites;
      });
    } catch (error) {
      console.error('Error al actualizar la lista de favoritos en la base de datos', error);
    }
  };
  
  return (
    <div className="home-page-container">
      <div className="header">
        <h1>Home</h1>
        <Link to={"/user"}><img src="src/assets/user.png" alt="User" /></Link>
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
            </div>
          ))
        ) : (
          <p className="noresult">No se encontraron resultados para "{searchName}".</p>
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
            <button onClick={() => handleFavoriteClick(selectedCharacter)}>
              {userFavorites.includes(selectedCharacter.id) ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
            </button>
            <button onClick={closeModal}>Close</button>
          </>
        )}
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

export default HomePage;
