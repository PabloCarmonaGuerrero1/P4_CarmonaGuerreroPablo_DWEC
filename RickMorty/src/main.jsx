import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './routes/App'
import { UserProvider } from './context/UserContext'
import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={App}/>
    </UserProvider>
  </React.StrictMode>,
)
