import { Box, Divider, Flex, Heading, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import Account from '../account/Account'
import {MdViewColumn} from 'react-icons/md'
import {BiHomeAlt2} from 'react-icons/bi'
import { GiTwoCoins } from 'react-icons/gi'
import {FaGalacticRepublic, FaUserFriends} from 'react-icons/fa'
import { VscActivateBreakpoints } from 'react-icons/vsc'
import { AiTwotoneHome } from 'react-icons/ai'

export default function PortfolioNavBar() {
  return (
    <>
    <Flex flexDir={'column'}>
        <Box py={10}>
            <Account/>
        </Box>
        <Divider/>
        <NavLink link={'/portfolio'} text={'Overview'} icon={<AiTwotoneHome/>}/>
        <Divider/>
        <NavLink link={'/portfolio/activity'} text={'Activity'} icon={<VscActivateBreakpoints />}/>
        <Divider/>
        <NavLink link={'/portfolio/refer'} text={'Refer and Earn'} icon={<FaUserFriends/>}/>
        <Divider/>
        <NavLink link={'/portfolio/rewards'} text={'Rewards'} icon={<GiTwoCoins/>}/>
        <Divider/>
    </Flex>
    </>
  )
}

function NavLink ({link, text, icon}: any) {
    const router = useRouter()
    return (
        <Link href={link} as={link}>
            <Flex align={'center'} gap={2} px={6} py={4} bg={link == router.pathname ? 'background.500' : 'background.600'} _hover={{bg: 'background.500'}} borderLeft={'4px'} borderLeftColor={link == router.pathname ? 'primary.400': 'transparent'}>
                {icon}
                <Heading size={'sm'} fontWeight='bold' fontFamily={'Space Grotesk'}>{text}</Heading>
            </Flex>
        </Link>
    )
}
