import {
  Button,
  Container,
  Grid,
  Heading,
  Image,
  Input,
  Select,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import Sidebar from '../Sidebar';
import cursor from '../../../assets/images/cursor.png';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { fileUploadCSS } from '../../Auth/Register';
import { useDispatch, useSelector } from 'react-redux';
import { createCourse } from '../../../redux/actions/admin';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector(state => state.admin);

  const changeImageHandler = e => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => {
      setImagePreview(fileReader.result);
      setImage(file);
    };
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

  const createCourseHandler = e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('createdBy', createdBy);
    formData.append('file', image);

    dispatch(createCourse(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearError' });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: 'clearMessage' });
      navigate('/admin/courses');
    }
  }, [dispatch, error, message, navigate]);

  return (
    <Grid
      css={{
        cursor: `url(${cursor}), default`,
      }}
      minH={'100vh'}
      templateColumns={['1fr', '5fr 1fr']}
    >
      <Container py="16">
        <form onSubmit={createCourseHandler}>
          <Heading
            textTransform={'uppercase'}
            children="Create Course"
            my="16"
            textAlign={['center', 'left']}
          />

          <VStack m="auto" spacing={'8'}>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
              type={'text'}
              focusBorderColor={'purple.300'}
            />
            <Input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description"
              type={'text'}
              focusBorderColor={'purple.300'}
            />
            <Input
              value={createdBy}
              onChange={e => setCreatedBy(e.target.value)}
              placeholder="Creator Name"
              type={'text'}
              focusBorderColor={'purple.300'}
            />

            <Select
              focusBorderColor="purple.300"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">Category</option>

              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </Select>

            <Input
              accept="image/*"
              required
              type={'file'}
              focusBorderColor={'purple.300'}
              css={{
                '&::file-selector-button': {
                  ...fileUploadCSS,
                  color: 'purple',
                },
              }}
              onChange={changeImageHandler}
            />

            {imagePreview && (
              <Image src={imagePreview} boxSize="64" objectFit={'contain'} />
            )}

            <Button
              isLoading={loading}
              w={'full'}
              colorScheme={'purple'}
              type={'submit'}
            >
              Create Course
            </Button>
          </VStack>
        </form>
      </Container>
      <Sidebar />
    </Grid>
  );
};

export default CreateCourse;
