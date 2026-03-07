import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await api.post('/users/logout/', {}, { withCredentials: true }); // include cookies
      } catch (err) {
        console.error('Logout failed:', err);
        toast.error("Logout failed")
        // Even if server fails, proceed to client-side cleanup
      } finally {
        // Clear any client-side auth state/storage
        localStorage.clear();
        sessionStorage.clear();
        document.cookie = "access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.dispatchEvent(new Event("authChange"));
        navigate('/', { replace: true });
        window.location.reload(); // Hard reload to clear all states
      }
    };
    doLogout();
  }, [navigate]);

  return <div />;
};

export default Logout;
