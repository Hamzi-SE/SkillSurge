import { Spinner, VStack } from '@chakra-ui/react';
import React from 'react';
import { useLocation } from 'react-router-dom';

const Loader = ({ color = 'yellow.500' }) => {
  const location = useLocation();

  // if pathname includes /admin, then use the admin color
  if (location.pathname.includes('/admin')) {
    color = 'purple.500';
  }

  return (
    <VStack h="100vh" justifyContent={'center'}>
      <div style={{ transform: 'scale(3)' }}>
        <Spinner
          thickness="2px"
          speed="0.65s"
          emptyColor="transparent"
          color={color}
          size="xl"
        />
      </div>
    </VStack>
  );
};

export default Loader;
