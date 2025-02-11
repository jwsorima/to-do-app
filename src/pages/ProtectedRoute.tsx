import { useState, useEffect, startTransition } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { Loading } from '../components/Loading';

export default function ProtectedRoute () {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const checkAuthentication = async () => {
      try {
        // await axios.get(`${import.meta.env.VITE_BE_DOMAIN_NAME}/auth-status`, { withCredentials: true });
        await axios.get(`${import.meta.env.VITE_BE_DOMAIN_NAME}/api/auth-status`);
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(true);
        // setIsLoggedIn(false);
      } finally {
        setTimeout(() => {
          startTransition(() => {
            setIsLoading(false);
          })
        }, 1000)
      }
    };

    checkAuthentication();

    return () => clearTimeout(timeoutId);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return isLoggedIn ? (
    <Outlet/>
  ) : (
    <Navigate to="/" replace />
  );
};

