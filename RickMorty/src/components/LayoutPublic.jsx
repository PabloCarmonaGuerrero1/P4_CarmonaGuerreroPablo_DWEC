import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './NavBar'

const LayoutRoot = () => {
  return (
    <div>
      < Navbar />
      < Outlet />
    </div>
  )
}

export default LayoutRoot