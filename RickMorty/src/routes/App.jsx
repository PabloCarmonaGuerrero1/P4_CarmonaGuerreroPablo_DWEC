import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import Login from '../pages/Login'
import Register from '../pages/Register'
import User from '../pages/User'
import NotFound from '../pages/NotFound'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<User />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App