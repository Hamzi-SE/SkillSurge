import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Image,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import Sidebar from '../Sidebar';
import cursor from '../../../assets/images/cursor.png';
import { RiDeleteBin7Fill } from 'react-icons/ri';
import CourseModal from './CourseModal';

const AdminCourses = () => {
  const courses = [
    {
      _id: '123asdzxc123asd',
      poster: {
        url: 'https://cdn.pixabay.com/photo/2020/01/26/20/14/computer-4795762_960_720.jpg',
      },
      title: 'React Course',
      category: 'Web Development',
      createdBy: 'Hamza',
      views: 123,
      numOfVideos: 12,
    },
  ];

  const { isOpen, onClose, onOpen } = useDisclosure();

  const courseDetailsHandler = courseId => {
    onOpen();
  };

  const deleteButtonHandler = courseId => {
    console.log(courseId);
  };

  const deleteLectureButtonHandler = (courseId, lectureId) => {
    console.log(courseId, lectureId);
  };

  const addLectureHandler = (e, courseId, title, description, video) => {
    e.preventDefault();
    console.log(courseId);
  };

  return (
    <Grid
      css={{
        cursor: `url(${cursor}), default`,
      }}
      minH={'100vh'}
      templateColumns={['1fr', '5fr 1fr']}
    >
      <Box p={['0', '8']} overflowX="auto">
        <Heading
          textTransform={'uppercase'}
          children="All Courses"
          my="16"
          textAlign={['center', 'left']}
        />

        <TableContainer w={['100vw', 'full']}>
          <Table variant="simple" size={'lg'}>
            <TableCaption>All available courses in the database</TableCaption>

            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Poster</Th>
                <Th>Title</Th>
                <Th>Category</Th>
                <Th>Creator</Th>
                <Th isNumeric>Views</Th>
                <Th isNumeric>Lectures</Th>
                <Th isNumeric>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {courses.map(item => (
                <Row
                  key={item._id}
                  item={item}
                  courseDetailsHandler={courseDetailsHandler}
                  deleteButtonHandler={deleteButtonHandler}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <CourseModal
          isOpen={isOpen}
          onClose={onClose}
          id={'asddsadsazxczxqw'}
          courseTitle={'React Course'}
          deleteButtonHandler={deleteLectureButtonHandler}
          addLectureHandler={addLectureHandler}
        />
      </Box>
      <Sidebar />
    </Grid>
  );
};

function Row({ item, courseDetailsHandler, deleteButtonHandler }) {
  return (
    <Tr>
      <Td>#{item._id}</Td>
      <Td>
        <Image src={item.poster.url} />
      </Td>
      <Td>{item.title}</Td>
      <Td textTransform={'uppercase'}>{item.category}</Td>

      <Td>{item.createdBy}</Td>

      <Td isNumeric>{item.views}</Td>
      <Td isNumeric>{item.numOfVideos}</Td>

      <Td isNumeric>
        <HStack justifyContent={'flex-end'}>
          <Button
            variant={'outline'}
            color="purple.500"
            onClick={() => courseDetailsHandler(item._id)}
          >
            View Lectures
          </Button>
          <Button
            onClick={() => deleteButtonHandler(item._id)}
            color={'purple.600'}
          >
            <RiDeleteBin7Fill />{' '}
          </Button>
        </HStack>
      </Td>
    </Tr>
  );
}

export default AdminCourses;
