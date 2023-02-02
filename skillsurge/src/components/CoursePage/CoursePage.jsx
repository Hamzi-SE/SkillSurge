import React from 'react';
import { Box, Grid, Heading, Text, VStack } from '@chakra-ui/react';
import introVideo from '../../assets/videos/intro.mp4';
import { useState } from 'react';

const CoursePage = () => {
  const [lectureNumber, setLectureNumber] = useState(0);

  const lectures = [
    {
      _id: 'sadasdasd',
      title: 'Sample Lecture',
      description: 'Sample description text',
      video: {
        url: 'https://youtube.com/xyzz',
      },
    },
    {
      _id: 'dasdsanxzc',
      title: 'Sample Lecture 2',
      description: 'Sample description 2 text',
      video: {
        url: 'https://youtube.com/xyzzz',
      },
    },
    {
      _id: 'daassdasdsanxzc',
      title: 'Sample Lecture 3',
      description: 'Sample description 3 text',
      video: {
        url: 'https://youtube.com/xyzzzz',
      },
    },
  ];
  return (
    <Grid minH={'90vh'} templateColumns={['1fr', '3fr 1fr']}>
      <Box>
        <video
          width={'100%'}
          controls
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          src={introVideo}
        ></video>

        <Heading
          children={`#${lectureNumber + 1} ${lectures[lectureNumber].title}`}
          m="4"
        />

        <Heading children="Description" m="4" />

        <Text children={lectures[lectureNumber].description} m="4" />
      </Box>

      <VStack>
        <Heading children="Lectures" m="4" />

        {lectures.map((lecture, index) => (
          <button
            onClick={() => setLectureNumber(index)}
            key={lecture._id}
            style={{
              width: '100%',
              padding: '1rem',
              textAlign: 'center',
              margin: 0,
              borderBottom: '1px solid rgba(0,0,0,0.2)',
            }}
          >
            <Text noOfLines={1}>
              #{index + 1} {lecture.title}
            </Text>
          </button>
        ))}
      </VStack>
    </Grid>
  );
};

export default CoursePage;
