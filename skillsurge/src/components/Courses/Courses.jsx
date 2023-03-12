import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import CourseCard from './CourseCard';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCourses } from '../../redux/actions/course';
import toast from 'react-hot-toast';
import { addToPlaylist } from '../../redux/actions/profile';
import { loadUser } from '../../redux/actions/user';

const Courses = () => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');

  const dispatch = useDispatch();
  const { loading, courses, error, message } = useSelector(
    state => state.courses
  );

  const addToPlaylistHandler = async courseId => {
    await dispatch(addToPlaylist(courseId));
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

  useEffect(() => {
    dispatch(getAllCourses(category, keyword));

    if (error) {
      toast.error(error);
      dispatch({ type: 'clearError' });
    }

    if (message) {
      toast.success(message);
      dispatch({ type: 'clearMessage' });
      dispatch(loadUser());
    }
  }, [dispatch, category, keyword, error, message]);

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

          '&::-webkit-scrollbar-track': {
            backgroundColor: '#CBD5E0',
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
        {courses.length > 0 ? (
          courses?.map(course => (
            <CourseCard
              key={course._id}
              title={course.title}
              imgSrc={course.poster.url}
              views={course.views}
              id={course._id}
              creator={course.createdBy}
              description={course.description}
              lectureCount={course.numOfVideos}
              addToPlaylistHandler={addToPlaylistHandler}
              loading={loading}
            />
          ))
        ) : loading ? (
          <Heading children="Loading..." mt={4} />
        ) : (
          <Heading children="Courses Not Found" mt={4} />
        )}
      </Stack>
    </Container>
  );
};

export default Courses;
