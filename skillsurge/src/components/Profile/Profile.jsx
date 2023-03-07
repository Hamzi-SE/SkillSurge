import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Container,
  Heading,
  HStack,
  Image,
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
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { RiDeleteBin7Fill } from 'react-icons/ri';
import { fileUploadCSS } from '../Auth/Register';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeFromPlaylist,
  updateProfilePicture,
} from '../../redux/actions/profile';
import { loadUser } from '../../redux/actions/user';
import { toast } from 'react-hot-toast';
import { cancelSubscription } from '../../redux/actions/subscription';

const Profile = ({ user }) => {
  const dispatch = useDispatch();
  const { loading, message, error } = useSelector(state => state.profile);
  const {
    loading: subscriptionLoading,
    message: subscriptionMessage,
    error: subscriptionError,
  } = useSelector(state => state.subscription);

  const removeFromPlaylistHandler = async courseId => {
    await dispatch(removeFromPlaylist(courseId));
    dispatch(loadUser());
  };

  const changeImageSubmitHandler = async (e, image) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', image);

    await dispatch(updateProfilePicture(formData));
    dispatch(loadUser());
  };

  const cancelSubscriptionHandler = async () => {
    await dispatch(cancelSubscription());
  };

  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearError' });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: 'clearMessage' });
    }
    if (subscriptionError) {
      toast.error(subscriptionError);
      dispatch({ type: 'clearError' });
    }
    if (subscriptionMessage) {
      toast.success(subscriptionMessage);
      dispatch({ type: 'clearMessage' });

      dispatch(loadUser());
    }
  }, [dispatch, error, message, subscriptionError, subscriptionMessage]);

  return (
    <Container minH={'95vh'} maxW="container.lg" py={'8'}>
      <Heading children={'Profile'} m="8" textTransform={'uppercase'} />
      <Stack
        justifyContent={'flex-start'}
        direction={['column', 'row']}
        alignItems={'center'}
        spacing={['8', '16']}
        padding="8"
      >
        <VStack>
          <Avatar boxSize={'48'} src={user?.avatar?.url} />
          <Button onClick={onOpen} colorScheme={'yellow'} variant="ghost">
            Change Photo
          </Button>
        </VStack>

        <VStack spacing={'4'} alignItems={['center', 'flex-start']}>
          <HStack>
            <Text children="Name" fontWeight={'bold'} />
            <Text children={user?.name} />
          </HStack>

          <HStack>
            <Text children="Email" fontWeight={'bold'} />
            <Text children={user?.email} />
          </HStack>

          <HStack>
            <Text children="CreatedAt" fontWeight={'bold'} />
            <Text children={user?.createdAt.split('T')[0]} />
          </HStack>

          {user?.role !== 'admin' && (
            <HStack>
              <Text children="Subscription" fontWeight={'bold'} />
              {user?.subscription?.status === 'active' ? (
                <Button
                  isLoading={subscriptionLoading}
                  onClick={cancelSubscriptionHandler}
                  color={'yellow.500'}
                  variant={'unstyled'}
                >
                  Cancel Subscription
                </Button>
              ) : (
                <Link to="/subscribe">
                  <Button colorScheme={'yellow'}>Subscribe</Button>
                </Link>
              )}
            </HStack>
          )}

          <Stack direction={['column', 'row']} alignItems={'center'}>
            <Link to="/update-profile">
              <Button>Update Profile</Button>
            </Link>
            <Link to="/change-password">
              <Button>Change Password</Button>
            </Link>
          </Stack>
        </VStack>
      </Stack>

      <Heading children="Playlist" size={'md'} my="8" />

      {user?.playlist?.length > 0 && (
        <Stack
          direction={['column', 'row']}
          alignItems={'center'}
          flexWrap="wrap"
          p="4"
        >
          {user?.playlist?.map(item => (
            <VStack w="48" m="2" key={item.course}>
              <Image boxSize={'full'} objectFit={'contain'} src={item.poster} />
              <HStack>
                <Link to={`/course/${item.course}`}>
                  <Button variant={'ghost'} colorScheme={'yellow'}>
                    Watch Now
                  </Button>
                </Link>

                <Button
                  isLoading={loading}
                  onClick={() => removeFromPlaylistHandler(item.course)}
                >
                  <RiDeleteBin7Fill />
                </Button>
              </HStack>
            </VStack>
          ))}
        </Stack>
      )}

      <ChangePhotoBox
        changeImageSubmitHandler={changeImageSubmitHandler}
        isOpen={isOpen}
        onClose={onClose}
        loading={loading}
      />
    </Container>
  );
};

export default Profile;

function ChangePhotoBox({
  isOpen,
  onClose,
  changeImageSubmitHandler,
  loading,
}) {
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);

  const changeImageHandler = e => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => {
      setImagePreview(fileReader.result);
      setImage(file);
    };
  };

  const closeHandler = () => {
    onClose();
    setImagePreview(null);
    setImage(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={closeHandler}>
      <ModalOverlay backdropFilter={'blur(10px)'} />
      <ModalContent>
        <ModalHeader>Change Photo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Container>
            <form onSubmit={e => changeImageSubmitHandler(e, image)}>
              <VStack spacing={'8'}>
                {imagePreview && <Avatar src={imagePreview} boxSize={'48'} />}
                <Input
                  type={'file'}
                  accept={'image/*'}
                  onChange={changeImageHandler}
                  css={{ '&::file-selector-button': fileUploadCSS }}
                />

                <Button
                  isLoading={loading}
                  w="full"
                  colorScheme={'yellow'}
                  type={'submit'}
                >
                  Change
                </Button>
              </VStack>
            </form>
          </Container>
        </ModalBody>

        <ModalFooter>
          <Button mr={'3'} onClick={closeHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
