import { CONTRACT_ID } from '@/constants';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { Button, Flex, Heading, Text } from '@chakra-ui/react'
import { Transaction } from '@near-wallet-selector/core';
import React from 'react'
import router from 'next/router';

export default function SignOut() {
    const { selector, modal, accounts, accountId } = useWalletSelector();
    const handleSignOut = async () => {
		const wallet = await selector.wallet();
		wallet.signOut()
        .then(async(_) => {
            // push to /spot
            console.log("Signed out");
            await router.push('/spot');
            // reload the page
            window.location.reload();
        })
        
        .catch((err) => {
			console.log("Failed to sign out");
			console.error(err);
		});
	};
  return (
    <Flex flexDir={'column'} h='300px' bg={'background2'} justify='center' px={6}>
        <Heading size={'lg'}>Sign Out</Heading>
        <Text mt={2}>Do you wish to log out of our account {accountId}?</Text>
        <Button w={'20%'} onClick={handleSignOut} mt={6}>Sign Out</Button>
    </Flex>
  )
}
