import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react'
import React from 'react'

export default function ComingSoon() {
  return (
    <>
      <Flex h={'90vh'} align='center' justify={'center'} bg='background.600'>
        <Flex flexDir={'column'} align='center'>
          <Image w={80} src='https://media.tenor.com/g6nK3QsP8wkAAAAC/kdaeza-peepo.gif' alt='Coming Soon' />
          <Heading mt={5} size='md'>Coming Soon</Heading>
        </Flex>
        
      </Flex>
    </>
  )
}
