import React from "react";
import {
	Box,
	Divider,
	Flex,
} from "@chakra-ui/react";

import Head from "next/head";
import { useContext } from "react";
import { DataContext, DataProvider } from "@/contexts/DataProvider";
import Volume from "@/components/account/Volume";
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

				<Divider orientation="vertical" />
				<Flex flexGrow={1} minH='90vh' flexDir={'column'} bg={'background.600'}>
					<Volume  />
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