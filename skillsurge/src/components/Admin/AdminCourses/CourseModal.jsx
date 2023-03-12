import {
  Box,
  Button,
  Grid,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { RiDeleteBin7Fill } from 'react-icons/ri';
import { fileUploadCSS } from '../../Auth/Register';

const CourseModal = ({
  isOpen,
  onClose,
  id,
  title,
  setTitle,
  description,
  setDescription,
  video,
  setVideo,
  videoPreview,
  setVideoPreview,
  deleteButtonHandler,
  addLectureHandler,
  courseTitle,
  lectures = [],
  loading,
}) => {
  const changeVideoHandler = e => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => {
      setVideoPreview(fileReader.result);
      setVideo(file);
    };
  };

  const modalCloseHandler = () => {
    setTitle('');
    setDescription('');
    setVideo('');
    setVideoPreview('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      size="full"
      onClose={modalCloseHandler}
      scrollBehavior="outside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{courseTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody p="16">
          <Grid templateColumns={['1fr', '3fr 1fr']}>
            <Box px={['0', '16']}>
              <Box my="5">
                <Heading children={courseTitle} />
                <Heading children={`#${id}`} size="sm" opacity={0.4} />
              </Box>

              <Heading children={'Lectures'} size="lg" />

              {lectures.map((lecture, index) => (
                <VideoCard
                  key={index}
                  title={lecture.title}
                  description={lecture.description}
                  num={index + 1}
                  lectureId={lecture._id}
                  courseId={id}
                  deleteButtonHandler={deleteButtonHandler}
                  loading={loading}
                />
              ))}
            </Box>

            <Box>
              <form
                onSubmit={e =>
                  addLectureHandler(e, id, title, description, video)
                }
              >
                <VStack spacing={'4'}>
                  <Heading
                    children="Add Lecture"
                    size={'md'}
                    textTransform="uppercase"
                  />

                  <Input
                    focusBorderColor="purple.300"
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />

                  <Input
                    focusBorderColor="purple.300"
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />

                  <Input
                    accept="video/mp4"
                    required
                    type={'file'}
                    focusBorderColor={'purple.300'}
                    css={{
                      '&::file-selector-button': {
                        ...fileUploadCSS,
                        color: 'purple',
                      },
                    }}
                    onChange={changeVideoHandler}
                  />

                  {videoPreview && (
                    <video
                      controlsList="nodownload"
                      controls
                      src={videoPreview}
                    ></video>
                  )}

                  <Button
                    isLoading={loading}
                    w={'full'}
                    colorScheme={'purple'}
                    type="submit"
                  >
                    Upload
                  </Button>
                </VStack>
              </form>
            </Box>
          </Grid>
        </ModalBody>

        <ModalFooter>
          <Button onClick={modalCloseHandler}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CourseModal;

function VideoCard({
  title,
  description,
  num,
  lectureId,
  courseId,
  deleteButtonHandler,
  loading,
}) {
  return (
    <Stack
      direction={['column', 'row']}
      my="8"
      borderRadius={'lg'}
      boxShadow={'0 0 10px rgba(107,70,193,0.5)'}
      justifyContent={['flex-start', 'space-between']}
      p={['4', '8']}
    >
      <Box>
        <Heading children={`#${num} ${title}`} size="sm" />
        <Text children={description} />
      </Box>
      <Button
        isLoading={loading}
        color={'purple.600'}
        onClick={() => deleteButtonHandler(courseId, lectureId)}
      >
        <RiDeleteBin7Fill />
      </Button>
    </Stack>
  );
}
