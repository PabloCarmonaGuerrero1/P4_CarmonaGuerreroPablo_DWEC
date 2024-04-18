import { useState, useEffect } from "react";
import '../pages_css/HomePage.css';
import { toast, ToastContainer } from 'react-toastify';
import { useUser } from "../context/UserContext";
import { DBConfig } from "../DataBase/DBConfig";
import CharacterModal from "../components/ModalCharacter";
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
  const [db] = useState(null);
  const [resetPage, setResetPage] = useState(false);
  const [selectedGender, setSelectedGender] = useState("all");
  const [speciesList,setSpeciesList] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState("all");

  useEffect(() => {
    if (resetPage) {
      setCurrentPage(1);
      setResetPage(false);
    }
    fetchCharacters(currentPage, selectedStatus, searchName, selectedGender, selectedSpecies);
  }, [currentPage, selectedStatus, searchName, selectedGender, selectedSpecies,resetPage]);
  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        let allSpecies = [];
        let nextPage = "https://rickandmortyapi.com/api/character";
  
        while (nextPage) {
          const response = await fetch(nextPage);
          const data = await response.json();
          const species = data.results.map((character) => character.species);
          allSpecies = [...allSpecies, ...species];
          nextPage = data.info.next;
        }
  
        const uniqueSpecies = [...new Set(allSpecies)];
        setSpeciesList(uniqueSpecies);
      } catch (error) {
        console.error("Error fetching species list:", error);
      }
    };
  
    fetchSpecies();
  }, []);  
  const fetchCharacters = (page, status, name, gender, species) => {
    let url = `https://rickandmortyapi.com/api/character?page=${page}`;

    if (status !== "all") {
      url += `&status=${status}`;
    }
    if (gender !== "all") {
      url += `&gender=${gender}`;
    }
    if (name.trim() !== "") {
      url += `&name=${name}`;
    }
    if (species !== "all") {
      url += `&species=${species}`;
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

  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
    setResetPage(true);
  };

  const handleSpeciesChange = (e) => {
    setSelectedSpecies(e.target.value);
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
  const notify = ()=>{
    toast("Check User to see your profile")
  }
  const handleFavoriteClick = async (character) => {
    const isFavorite = userFavorites.includes(character.id);

    try {
      setUserFavorites((prevFavorites) => {
        notify()
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
      toast.info("Click on some character to see his/her information, you can add them to favourite too", { autoClose: false }); 
    }, 6000); 

    return () => {
      clearTimeout(timeoutId);
    };
  }, []); 
  return (
    <div className="home-page-container">
      <p>Filter By Character Information</p>
      <form className="filter-form">
        <label>
          Gender:
          <select value={selectedGender} onChange={handleGenderChange}>
            <option value="all">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="genderless">Genderless</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
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
        <label>
          Species:
          <select value={selectedSpecies} onChange={handleSpeciesChange}>
            <option value="all">All</option>
            {speciesList.map((species) => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>
        </label>
      </form>
      <div className="character-container">
        {characterData.length > 0 ? (
          characterData.map((character) => (
            <div key={character.id} className="character-card" onClick={() => openModal(character)}>
              <img src={character.image} alt="Character Image" className="character-image" />
              {userFavorites.includes(character.id)&&(
                <img src="src/assets/star.png" alt="favourite" className="favourite-icon"/>
              )}
            </div>
          ))
        ) : (
          <p className="noresult">No results found for {searchName}.</p>
        )}
      </div>
      <CharacterModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        character={selectedCharacter}
        onFavoriteClick={handleFavoriteClick}
        setUserFavorites={setUserFavorites}
        userFavorites={userFavorites}
      />
      <ToastContainer/>
      <div className="footer">
        <div className="pagination-container">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {maxId}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === maxId}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
