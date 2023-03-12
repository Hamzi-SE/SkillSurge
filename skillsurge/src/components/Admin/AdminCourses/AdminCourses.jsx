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
import React, { useEffect, useState } from 'react';
import Sidebar, { adminTableScrollbarStyle } from '../Sidebar';
import cursor from '../../../assets/images/cursor.png';
import toast from 'react-hot-toast';
import { RiDeleteBin7Fill } from 'react-icons/ri';
import CourseModal from './CourseModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllCourses,
  getCourseLectures,
} from '../../../redux/actions/course';
import {
  addLecture,
  deleteCourse,
  deleteLecture,
} from '../../../redux/actions/admin';

const AdminCourses = () => {
  const [courseId, setCourseId] = useState('');
  const [courseTitle, setCourseTitle] = useState('');

  // Lecture details - declaring here because we have to reset after successful creation
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState('');
  const [videoPreview, setVideoPreview] = useState('');

  const { courses, lectures } = useSelector(state => state.courses);
  const { loading, error, message } = useSelector(state => state.admin);
  const dispatch = useDispatch();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setVideo('');
    setVideoPreview('');
  };

  const courseDetailsHandler = (courseId, courseTitle) => {
    setCourseId(courseId);
    setCourseTitle(courseTitle);
    dispatch(getCourseLectures(courseId));
    onOpen();
  };

  const deleteButtonHandler = courseId => {
    dispatch(deleteCourse(courseId));
  };

  const deleteLectureButtonHandler = async (courseId, lectureId) => {
    await dispatch(deleteLecture(courseId, lectureId));

    dispatch(getCourseLectures(courseId));
  };

  const addLectureHandler = async (e, courseId, title, description, video) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', video);

    await dispatch(addLecture(courseId, formData));

    dispatch(getCourseLectures(courseId));
  };

  useEffect(() => {
    dispatch(getAllCourses());

    if (error) {
      toast.error(error);
      dispatch({ type: 'clearError' });
    }

    if (message) {
      toast.success(message);
      dispatch({ type: 'clearMessage' });
      resetForm();
    }
  }, [dispatch, message, error]);

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

        <TableContainer w={['100vw', 'full']} css={adminTableScrollbarStyle}>
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
                  loading={loading}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <CourseModal
          isOpen={isOpen}
          onClose={onClose}
          id={courseId}
          courseTitle={courseTitle}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          video={video}
          setVideo={setVideo}
          videoPreview={videoPreview}
          setVideoPreview={setVideoPreview}
          deleteButtonHandler={deleteLectureButtonHandler}
          addLectureHandler={addLectureHandler}
          lectures={lectures}
          loading={loading}
        />
      </Box>
      <Sidebar />
    </Grid>
  );
};

function Row({ item, courseDetailsHandler, deleteButtonHandler, loading }) {
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
            isLoading={loading}
            variant={'outline'}
            color="purple.500"
            onClick={() => courseDetailsHandler(item._id, item.title)}
          >
            View Lectures
          </Button>
          <Button
            isLoading={loading}
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
