import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

const LayoutPrivate = () => {

  const {user, setUser} = useContext(UserContext)

  return ( 
    <>
      {
        user? <Outlet /> : <Navigate to ="/" />
      }
    </>
  )
}

export default LayoutPrivate