import HomePage from '../pages/HomePage';
import LayoutRoot from '../components/LayoutPublic';
import LayoutPrivate from '../components/LayoutPrivate';
import Login from '../pages/Login';
import Register from '../pages/Register';
import User from '../pages/User';
import NotFound from '../pages/NotFound';
import { createBrowserRouter } from 'react-router-dom';
import ContactPage from '../pages/ContactPage';

const App = createBrowserRouter([
  {
    path: "/",
    element: <LayoutRoot />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "/Register",
        element: <Register />,
      },
      {
        path: "/HomePage",
        element: <LayoutPrivate />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
        ],
      },
      {
        path: "/User",
        element: <LayoutPrivate />,
        children: [
          {
            index: true,
            element: <User />,
          },
        ],
      },
      {
        path: "/ContactPage",
        element: <LayoutPrivate />,
        children: [
          {
            index: true,
            element: <ContactPage />,
          },
        ],
      },
    ],
  },
]);

export default App;
