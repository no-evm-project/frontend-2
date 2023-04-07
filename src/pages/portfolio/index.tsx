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

export default function Portfolio() {
	const {
		tokens,
		tokenList,
		balances,
		account,
		pairs,
		accountInfo,
		trades,
		userVolume,
	} = useContext(DataContext);

	if(!account) return <></>;

	// create a list of token balances in USDC
	const tokenBalances = tokenList.map((tokenSymbol: string) => {
		if(tokenSymbol === 'USDC') {
			return balances[tokenSymbol]?.holding ?? 0;
		}
		const token = tokens[tokenSymbol];
		const balance: any = balances[tokenSymbol];
		if(!trades[`SPOT_${tokenSymbol}_USDC`]) return 0;
		const price = trades[`SPOT_${tokenSymbol}_USDC`][0]?.executed_price;
		const holding = balance?.holding ?? 0;
		const totalValue = holding * price;
		return totalValue;
	});

	const totalUSDC = tokenBalances.reduce((partialSum: any, a: any) => partialSum + a, 0);


	return (
		<>
			<Head>
				<title>Portfolio | ZEXE | Buy & Sell Crypto on ZEXE</title>
				<link rel="icon" type="image/x-icon" href="/x.png"></link>
			</Head>
			<Flex minH={{xs: '0', sm: '0', md: '90vh'}} flexDir={{xs: 'column', sm: 'column', md: 'row'}}>
				<Flex bg='background.600' mx={0} my={0}>
					<PortfolioNavBar/>
				</Flex>
				<ResponsiveDivider/>
				
				<Flex flexGrow={1} flexDir={'column'} my={0} bg={'background.600'}>
					<Flex align={'start'} justify='space-between'>
						<Flex flexDir={'column'} mb='50px' justify='space-between'>
							<Heading size={'md'} px={6} mt={'50px'}>Overview</Heading>
							<Box mt={8}>
								<Heading size={'sm'} px={6} color='whiteAlpha.700'>Trading Balance</Heading>
								<Text mt={1} px={6} fontSize={"2xl"}>
									{dollarFormatter.format(totalUSDC)}
								</Text>
							</Box>
						</Flex>
						{/* <Flex justify={'end'} h={300} w={'60%'}>
							<PortfolioPie tokenBalances={tokenBalances}/>
						</Flex> */}
					</Flex>
					<Box maxW={'1000px'}>
						<Balances tokenBalances={tokenBalances} />
					</Box>
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