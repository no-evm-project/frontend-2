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
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { FaKey } from "react-icons/fa";
import { BiExit, BiStats, BiTag } from "react-icons/bi";
import { RiDashboardFill } from "react-icons/ri";
import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import Overview from "@/components/account/Overview";
import SignOut from "@/components/account/SignOut";
import ComingSoon from "@/components/account/ComingSoon";
import { useContext } from "react";
import { DataContext, DataProvider } from "@/contexts/DataProvider";
import BN from "bn.js";
import Volume from "@/components/account/Volume";
import Account from "@/components/account/Account";
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

			<Flex>
				<Flex bg='background2' mx={1} my={1}>
					<PortfolioNavBar/>
				</Flex>
				<Flex w={'80%'} flexDir={'column'} my={1} bg={'background2'}>
					<Heading size={'md'} mt={10} px={6}>Overview</Heading>
					<Flex align={'center'}>
						<Box w={'40%'}>
							<Heading size={'sm'} mt={6} px={6} color='whiteAlpha.700'>Trading Balance</Heading>
							<Text mt={1} px={6} fontSize={"2xl"}>
								{dollarFormatter.format(totalUSDC)}
							</Text>
						</Box>
						<Flex justify={'end'} h={250} w={'60%'}>
							<PortfolioPie tokenBalances={tokenBalances}/>
						</Flex>
					</Flex>
					<Box mt={0}>
						<Balances tokenBalances={tokenBalances} />
					</Box>
				</Flex>
			</Flex>
		</>
	);
}
