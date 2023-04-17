import React from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../Layout/Loader/Loader';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, isAuthenticated }) => {
  const navigate = useNavigate();

  const { loading } = useSelector(state => state.user);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated && !loading) {
    navigate('/login');
  }

  return <>{children}</>;
};

export default ProtectedRoute;
