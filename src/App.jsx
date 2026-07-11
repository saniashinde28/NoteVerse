import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import './App.css'
import authService from '../appwrite/auth';
import { login, logout } from '../store/authSlice'
import { Outlet } from 'react-router-dom';
import { Header } from './components';
import { Footer } from './components';
import service from '../appwrite/config';

function App() {
  //loading state for conditional rendering
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    async function loadUser() {

      const userData = await authService.getCurrentUser();

      if (userData) {

        const profile = await service.getProfileByUserId(userData.$id);

        dispatch(
          login({
            userData,
            profile
          })
        );

      } else {
        dispatch(logout());
      }

      setLoading(false);
    }

    loadUser();
  }, [])

  return !loading ? <div className='min-h-screen flex flex-wrap content-n=between bg-gray-400'>
    <div className='w-full block'>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  </div> : (null)
}

export default App
