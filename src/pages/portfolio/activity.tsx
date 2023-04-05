import React from "react";
import {
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

			<Flex>
				<Flex bg='background.600' >
					<PortfolioNavBar/>
				</Flex>
				<Divider orientation="vertical" minH={'90vh'} />
				<Flex flexGrow={1} minH='90vh' flexDir={'column'} bg={'background.600'}>
					<Volume  />
				</Flex>
			</Flex>
		</>
	);
}
