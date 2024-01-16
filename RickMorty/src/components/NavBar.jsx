import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import "../pages_css/NavBar.css"
const Navbar = () => {
  const { user, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();

  const cerrarSesion = () => {
    logoutUser(); 
    navigate('/');
  };

  return (
    <nav>
      {user ? (
        <>
          <NavLink to="/HomePage">HomePage</NavLink>
          <NavLink to="/User">User</NavLink>
          <NavLink to="/ContactPage">Contact</NavLink>
          <button onClick={cerrarSesion}>Logout</button>
        </>
      ) : (
        <>
          <NavLink to="/">Login</NavLink>
          <NavLink to={"/Register"}>Register</NavLink>
        </>
      )}
    </nav>
  );
};

export default Navbar;
