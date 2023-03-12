import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import Sidebar, { adminTableScrollbarStyle } from '../Sidebar';
import cursor from '../../../assets/images/cursor.png';
import { RiDeleteBin7Fill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteUser,
  getAllUsers,
  updateUserRole,
} from '../../../redux/actions/admin';
import toast from 'react-hot-toast';

const Users = () => {
  const { users, loading, error, message } = useSelector(state => state.admin);
  const dispatch = useDispatch();

  const updateUserRoleHandler = userId => {
    dispatch(updateUserRole(userId));
  };

  const deleteUserHandler = userId => {
    dispatch(deleteUser(userId));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearError' });
    }

    if (message) {
      toast.success(message);
      dispatch({ type: 'clearMessage' });
    }

    dispatch(getAllUsers());
  }, [dispatch, message, error]);

  return (
    <Grid
      css={{
        cursor: `url(${cursor}), default`,
      }}
      minH={'100vh'}
      templateColumns={['1fr', '5fr 1fr']}
    >
      <Box p={['0', '16']} overflowX="auto">
        <Heading
          textTransform={'uppercase'}
          children="All Users"
          my="16"
          textAlign={['center', 'left']}
        />

        <TableContainer w={['100vw', 'full']} css={adminTableScrollbarStyle}>
          <Table variant="simple" size={'lg'}>
            <TableCaption>All available users in the database</TableCaption>

            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Subscription</Th>
                <Th isNumeric>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users &&
                users.map(item => (
                  <Row
                    key={item._id}
                    item={item}
                    updateUserRoleHandler={updateUserRoleHandler}
                    deleteUserHandler={deleteUserHandler}
                    loading={loading}
                  />
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <Sidebar />
    </Grid>
  );
};

export default Users;

function Row({ item, updateUserRoleHandler, deleteUserHandler, loading }) {
  return (
    <Tr>
      <Td>#{item._id}</Td>
      <Td>{item.name}</Td>
      <Td>{item.email}</Td>
      <Td>{item.role}</Td>
      <Td>
        {item.subscription && item.subscription.status === 'active'
          ? 'Active'
          : 'Not Active'}
      </Td>
      <Td isNumeric>
        <HStack justifyContent={'flex-end'}>
          <Button
            variant={'outline'}
            color="purple.500"
            onClick={() => updateUserRoleHandler(item._id)}
            isLoading={loading}
          >
            Change Role
          </Button>
          <Button
            onClick={() => deleteUserHandler(item._id)}
            color={'purple.600'}
            variant={'outline'}
            isLoading={loading}
          >
            <RiDeleteBin7Fill />{' '}
          </Button>
        </HStack>
      </Td>
    </Tr>
  );
}
