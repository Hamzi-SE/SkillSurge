import React, { useState } from 'react';
import {
  Button,
  Container,
  Heading,
  HStack,
  Input,
  Stack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const CourseCard = ({
  views,
  title,
  imgSrc,
  id,
  addToPlaylistHandler,
  creator,
  description,
  lectureCount,
}) => {
  return (
    <VStack className="course" alignItems={['center', 'flex-start']}>
      <Image src={imgSrc} alt={title} boxSize="60" objectFit={'contain'} />
      <Heading
        textAlign={['center', 'left']}
        maxW="200px"
        size={'sm'}
        fontFamily={'sans-serif'}
        noOfLines={3}
        children={title}
      />
      <Text noOfLines={2} children={description} />
      <HStack>
        <Text
          fontWeight={'bold'}
          textTransform="uppercase"
          children={'Creator'}
        />
        <Text
          fontFamily={'body'}
          textTransform="uppercase"
          children={creator}
        />
      </HStack>
      <Heading
        textTransform="uppercase"
        size={'xs'}
        textAlign={'center'}
        children={`Lectures - ${lectureCount}`}
      />
      <Heading size={'xs'} textAlign={'center'} children={`Views - ${views}`} />
      <Stack direction={['column', 'row']} alignItems={'center'}>
        <Link to={`/course/${id}`}>
          <Button colorScheme="yellow" children={'View Course'} />
        </Link>
        <Button
          variant={'ghost'}
          colorScheme="yellow"
          onClick={() => addToPlaylistHandler(id)}
          children={'Add to playlist'}
        />
      </Stack>
    </VStack>
  );
};

const Courses = () => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');

  const addToPlaylistHandler = () => {
    console.log('Added to playlist');
  };

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Artificial Intelligence',
    'Data Structures & Algorithms',
    'Machine Learning',
    'Cloud Computing',
    'Cybersecurity',
    'Game Development',
  ];

  console.log(category);

  return (
    <Container minH={'95vh'} maxW={'container.lg'} paddingY={'8'}>
      <Heading textTransform={'uppercase'} children="All Courses" m={'8'} />

      <Input
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder="Search a course..."
        type={'text'}
        focusBorderColor="yellow.500"
      />

      <HStack
        overflowX={'auto'}
        paddingY="8"
        css={{
          '&::-webkit-scrollbar': {
            height: '8px',
          },

          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ECC94B',
            borderRadius: '0.5rem',
          },
        }}
      >
        {categories.map((category, index) => (
          <Button key={index} minW={'60'} onClick={() => setCategory(category)}>
            <Text children={category} />
          </Button>
        ))}
      </HStack>

      <Stack
        direction={['column', 'row']}
        flexWrap="wrap"
        justifyContent={['flex-start', 'space-evenly']}
        alignItems={['center', 'flex-start']}
        marginTop={'10'}
      >
        <CourseCard
          title={'MERN Stack Supreme'}
          imgSrc={
            'https://cdn.pixabay.com/photo/2020/01/26/20/14/computer-4795762_960_720.jpg'
          }
          views={1000}
          id={1}
          creator={'John Doe'}
          description={'Lorem ipsum dolor sit amet.'}
          lectureCount={10}
          addToPlaylistHandler={addToPlaylistHandler}
        />
      </Stack>
    </Container>
  );
};

export default Courses;
