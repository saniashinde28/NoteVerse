import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { lazy, Suspense } from 'react'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from '../store/store.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Protected from './components/AuthLayout.jsx'
const Home = lazy(() => import('./Pages/Home.jsx'));
const Login = lazy(() => import("./Pages/Login"));
const Signup = lazy(() => import("./Pages/Signup"));
const AddPost = lazy(() => import("./Pages/AddPost"));
const EditPost = lazy(() => import("./Pages/EditPost"));
const Profile = lazy(() => import("./Pages/Profile"));
const Search = lazy(() => import("./Pages/Search"));
const Post = lazy(() => import("./Pages/Post"));
const AllPosts = lazy(() => import("./Pages/AllPosts"));
import { Toaster } from 'sonner';
import ErrorPage from './Pages/ErrorPage';
import { ThemeProvider } from './context/ThemeContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./components/ErrorBoundary";
const queryClient = new QueryClient();

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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Suspense fallback={<div className="flex h-screen items-center justify-center">
            <p className="text-lg">Loading...</p>
          </div>}>
            <RouterProvider router={router} />
            <Toaster
              position="top-right"
              richColors
              closeButton
            />
          </Suspense>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </Provider >
)
