import { Box, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import Account from '../account/Account'

export default function PortfolioNavBar() {
  return (
    <>
    <Flex flexDir={'column'}>
        <Box py={10}>
            <Account/>
        </Box>

        <NavLink link={'/portfolio'} text={'Overview'}/>
        <NavLink link={'/portfolio/activity'} text={'Activity'}/>

    </Flex>
    </>
  )
}

function NavLink ({link, text}: any) {
    const router = useRouter()
    return (
        <Link href={link}>
            <Box px={6} py={4} bg={link == router.pathname ? 'whiteAlpha.50' : 'transparent'} _hover={{bg: 'whiteAlpha.200'}} borderLeft={'2px'} borderLeftColor={link == router.pathname ? 'primary.400': 'transparent'}>
                <Text fontSize={'md'} fontWeight='medium'>{text}</Text>
            </Box>
        </Link>
    )
}
