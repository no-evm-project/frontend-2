import React from "react";
import {
	Avatar,
	Box,
	Button,
	Divider,
	Flex,
	Heading,
	Progress,
	Text,
} from "@chakra-ui/react";

import Head from "next/head";
import { useContext } from "react";
import { DataContext, DataProvider } from "@/contexts/DataProvider";
import Balances from "@/components/account/Balances";
import PortfolioPie from "@/components/account/PortfolioPie";
import { dollarFormatter } from "@/utils";
import PortfolioNavBar from "@/components/portfolio/PortfolioNavBar";
import { Tag } from '@chakra-ui/react';

export default function Refer() {
	const {
		tokens,
		tokenList,
		balances,
		account,
	} = useContext(DataContext);

	if(!account) return <></>;

	return (
		<>
			<Head>
				<title>Refer and Earn | ZEXE | Buy & Sell Crypto on ZEXE</title>
				<link rel="icon" type="image/x-icon" href="/x.png"></link>
			</Head>

			<Flex minH={{xs: '0', sm: '0', md: '90vh'}} flexDir={{xs: 'column', sm: 'column', md: 'row'}}>
				<Flex bg='background.600'>
					<PortfolioNavBar/>
				</Flex>
				<ResponsiveDivider/>
				<Flex w={'80%'} flexDir={'column'} bg={'background.600'}>
					<Flex align={'start'} justify='space-between'>
						<Flex flexDir={'column'} mt={'50px'} px={6} mb='50px' justify='space-between'>
                            <Flex gap={2}>
							<Heading size={'md'}>Refer and Earn</Heading>
                            <Tag size={'sm'} bg={'primary.400'}>Coming Soon</Tag>
                            </Flex>
                            <Text mt={3} color='whiteAlpha.700'>Invite your friends to trade on ZEXE and earn 20% of their trading fees!</Text>
							<Box mt={8} >
								{/* <Text size={'sm'} color='whiteAlpha.700'>Coming Soon</Text> */}
							</Box>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</>
	);
}

const ResponsiveDivider = () => ( <>
	<Box display={{xs: 'none', sm: 'none', md: 'block'}}>
	<Divider orientation="vertical" h={'90vh'}/>
	</Box>
	<Box display={{xs: 'block', sm: 'block', md: 'none'}}>
	<Divider orientation="horizontal" w={'100vw'}/>
	</Box>
	</>
)