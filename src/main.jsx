import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from '../store/store.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Protected from './components/AuthLayout.jsx'
import Home from './Pages/Home.jsx'
import Login from './Pages/Login.jsx'
import AddPost from "./Pages/AddPost";
import Signup from './Pages/Signup'
import EditPost from "./Pages/EditPost";
import Profile from './Pages/Profile.jsx';
import Search from './Pages/Search';
import { Toaster } from 'sonner';
import ErrorPage from './Pages/ErrorPage';
import { ThemeProvider } from './context/ThemeContext'

import Post from "./Pages/Post";

import AllPosts from "./Pages/AllPosts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/login",
        element: (
          <Protected authentication={false}>
            <Login />
          </Protected>
        )
      },
      {
        path: "/signup",
        element: (
          <Protected authentication={false}>
            <Signup />
          </Protected>
        ),
      },
      {
        path: "/all-posts",
        element: (
          <Protected authentication>
            {" "}
            <AllPosts />
          </Protected>
        ),
      },
      {
        path: "/add-post",
        element: (
          <Protected authentication>
            {" "}
            <AddPost />
          </Protected>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <Protected authentication>
            {" "}
            <EditPost />
          </Protected>
        ),
      },
      {
        path: "/post/:slug",
        element: <Post />,
      },
      {
        path: "/profile/:username",
        element: (
          <Protected authentication>
            {" "}
            <Profile />
          </Protected>
        )
      },
      {
        path: "/search",
        element: <Search />,
      },
    ],
  },
])
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        richColors
        closeButton
      />
    </ThemeProvider>
  </Provider>
)
