import { DataContext } from '@/contexts/DataProvider';
import React from 'react'
import { useContext } from 'react';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Button,
  } from '@chakra-ui/react'
import { IoIosNotifications } from 'react-icons/io';

export default function Notifications() {
    const { notifications } = useContext(DataContext);
    return (
        <>
            <Menu>
  <MenuButton as={Button} h='45px' pt={1} variant='unstyled' rightIcon={<IoIosNotifications size={'21px'} />}></MenuButton>
  <MenuList rounded={0} bg='background.500'>

    {notifications.length > 0 ? notifications.map((notification: any, index: number) => {
        return (
            <MenuItem bg={'transparent'} _hover={{bg: 'transparent'}} key={index}>{JSON.stringify(notification)}</MenuItem>
        )
    }) : 
    
    <MenuItem bg={'transparent'} _hover={{bg: 'transparent'}}>No notifications</MenuItem>
    }
  </MenuList>
</Menu>
        </>
    )
}
