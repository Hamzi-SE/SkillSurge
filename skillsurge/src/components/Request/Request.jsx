import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormLabel,
  Heading,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Request = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');

  return (
    <Container h={'92vh'}>
      <VStack h="full" justifyContent={'center'} spacing={'16'}>
        <Heading textTransform={'uppercase'} children="Request New Course" />

        <form style={{ width: '100%' }}>
          <Box my={'4'}>
            <FormLabel htmlFor="name" children="Name" />
            <Input
              required
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your Name"
              type={'text'}
              focusBorderColor={'yellow.500'}
            />
          </Box>

          <Box my={'4'}>
            <FormLabel htmlFor="email" children="Email Address" />
            <Input
              required
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="abc@gmail.com"
              type={'email'}
              focusBorderColor={'yellow.500'}
            />
          </Box>

          <Box my={'4'}>
            <FormLabel htmlFor="course" children="Course" />
            <Textarea
              required
              id="course"
              value={course}
              onChange={e => setCourse(e.target.value)}
              placeholder="Explain the course..."
              focusBorderColor={'yellow.500'}
            />
          </Box>

          <Button my={'4'} colorScheme={'yellow'} type={'submit'}>
            Send Request
          </Button>

          <Box my={'4'}>
            See available courses!{' '}
            <Link to="/courses">
              <Button colorScheme={'yellow'} variant={'link'}>
                Click
              </Button>{' '}
            </Link>
            here
          </Box>
        </form>
      </VStack>
    </Container>
  );
};

export default Request;
