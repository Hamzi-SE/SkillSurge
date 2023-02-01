import React from 'react';
import { Box, Heading, HStack, Stack, VStack } from '@chakra-ui/react';
import {
  TiSocialLinkedinCircular,
  TiSocialInstagramCircular,
  TiSocialTwitterCircular,
  TiSocialFacebookCircular,
} from 'react-icons/ti';
import { DiGithub } from 'react-icons/di';

const Footer = () => {
  return (
    <Box padding={'4'} bg="blackAlpha.900" minH={'10vh'}>
      <Stack direction={['column', 'row']}>
        <VStack alignItems={['center', 'flex-start']} width="full">
          <Heading children="All Rights Reserved" color={'white'} />
          <Heading
            fontFamily={'body'}
            size="sm"
            children="@Hamza"
            color={'yellow.400'}
          />
        </VStack>
        <HStack
          spacing={['2', '10']}
          justifyContent="center"
          color={'white'}
          fontSize="50"
        >
          <a
            href="https://www.linkedin.com/in/hamzi-se/"
            rel="noreferrer"
            target={'blank'}
          >
            <TiSocialLinkedinCircular />
          </a>
          <a
            href="https://www.instagram.com/hamza._.se"
            rel="noreferrer"
            target={'blank'}
          >
            <TiSocialInstagramCircular />
          </a>
          <a
            href="https://twitter.com/Hamzii_SE"
            rel="noreferrer"
            target={'blank'}
          >
            <TiSocialTwitterCircular />
          </a>
          <a
            href="https://www.facebook.com/Hamzii.SE"
            rel="noreferrer"
            target={'blank'}
          >
            <TiSocialFacebookCircular />
          </a>
          <a
            href="https://github.com/Hamzi-SE"
            rel="noreferrer"
            target={'blank'}
          >
            <DiGithub />
          </a>
        </HStack>
      </Stack>
    </Box>
  );
};

export default Footer;
