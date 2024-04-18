import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import '../pages_css/User.css';
import { useUser } from '../context/UserContext';
import { DBConfig } from '../DataBase/DBConfig';
import { toast, ToastContainer } from 'react-toastify';
import CharacterModal from '../components/ModalCharacter';
const User = () => {
  const { user, loginUser } = useUser();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [characterData, setCharacterData] = useState([]);
  const [favoriteCharacters, setFavoriteCharacters] = useState(new Map());
  const [db] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxID, setMaxID] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [userFavorites, setUserFavorites] = useState(user ? user.favourite || [] : []);
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
  
    if (user && user.favourite) {
      setFavoriteCharacters(new Map(Object.entries(user.favourite)));
    }
  }, [currentPage, user]);
  

  const handleCharacterClick = async (character) => {
    setModalIsOpen(true);

    try {
      const updatedUser = { ...user, profile: character.id };
      loginUser(updatedUser);

      setFavoriteCharacters(new Map(Object.entries(updatedUser.favourite || {})));


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
    } finally {
      setModalIsOpen(false);
    }
  };
  const openModal2 = (selectedCharacter) => {
    characterdata2(selectedCharacter)
    setModalIsOpen2(true);
  };
  
  
  const closeModal2 = ()=>{
    setModalIsOpen2(false);
  }
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      toast.info("You can change your profile photo by clicking on the photo to the left of your username!", { autoClose: false }); 
    }, 6000); 

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  const characterdata2 = (selectedCharacter) =>{
    let url = `https://rickandmortyapi.com/api/character/${selectedCharacter}`
    fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error en la llamada a la API: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      setSelectedCharacter(data)
    })
    .catch((error) => {
      console.error("Error al llamar a la API:", error);
      setSelectedCharacter([]);
    });
  }
  return (
    <div className="user-container">
      <div className='user_profile'>
        {user && (
          <>
            <img
              src={`https://rickandmortyapi.com/api/character/avatar/${user.profile}.jpeg`}
              alt={user.profileName || user.name}
              onClick={() => setModalIsOpen(true)} className='profile'
            />
            <p className='name_profile'>{user.name}</p>
          </>
        )}
        <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
          <div>
          <h2>Select a image</h2>
          <div>
            {characterData.map((character) => (
              <div key={character.id} >
                <img src={character.image} alt="Imagen del personaje" onClick={() => handleCharacterClick(character)} />
              </div>
            ))}
          </div>
          <button onClick={() => setModalIsOpen(false)} className="close">Close</button>
          <div className="pagination-container">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === maxID}>
              Next
            </button>
          </div>
          </div>

        </Modal>
      </div>
      <ToastContainer/>
      <div className='favorite-characters'>
        <h2>Fav Characters</h2>
        <div>
          {Array.from(favoriteCharacters.values()).map((characterId) => (
            <div key={characterId} onClick={() => openModal2(characterId)}>
              <img src={`https://rickandmortyapi.com/api/character/avatar/${characterId}.jpeg`} alt="Favourite" />
            </div>
          ))}
        </div>
        <CharacterModal
        isOpen={modalIsOpen2}
        onRequestClose={closeModal2}
        character={selectedCharacter}
        onFavoriteClick={handleFavoriteClick}
        setUserFavorites={setUserFavorites}
        userFavorites={userFavorites}
      />

      </div>
    </div>
  );
};

export default User;
