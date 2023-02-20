import React from 'react';
import {
  Button,
  Heading,
  HStack,
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
  loading,
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
          isLoading={loading}
          variant={'ghost'}
          colorScheme="yellow"
          onClick={() => addToPlaylistHandler(id)}
          children={'Add to playlist'}
        />
      </Stack>
    </VStack>
  );
};

export default CourseCard;
