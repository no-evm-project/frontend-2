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
import PortfolioNavBar from "@/components/portfolio/PortfolioNavBar";
import { Tag } from "@chakra-ui/react";
import { HiOutlineHandRaised } from "react-icons/hi2";
import { AiOutlineAreaChart } from "react-icons/ai";

export default function Rewards() {
	const { account } = useContext(DataContext);

	if (!account) return <></>;

	return (
		<>
			<Head>
				<title>Trading Rewards | ZEXE | Buy & Sell Crypto on ZEXE</title>
				<link rel="icon" type="image/x-icon" href="/x.png"></link>
			</Head>

			<Flex minH={{xs: '0', sm: '0', md: '90vh'}} flexDir={{xs: 'column', sm: 'column', md: 'row'}}>
				<Flex bg="background.600">
					<PortfolioNavBar />
				</Flex>
				<ResponsiveDivider/>
				<Flex w={"80%"} flexDir={"column"} bg={"background.600"}>
					<Flex align={"start"} justify="space-between">
						<Flex
							flexDir={"column"}
							mt={"50px"}
							px={6}
							mb="50px"
							justify="space-between"
						>
							<Flex gap={2}>
								<Heading size={"md"}>Trading Rewards</Heading>
								<Tag size={"sm"} bg={"primary.400"}>
									Coming Soon
								</Tag>
							</Flex>
							<Text mt={3} color="whiteAlpha.700">
								Trade more, bid smarter, and get rewarded with $ZEX tokens every day.
							</Text>
							<Flex gap={10}>
								<Box mt={8} maxW="400px">
									<HiOutlineHandRaised size={20}/>
									<Heading mt={4} size={"sm"} color="whiteAlpha.700">
										Placing bids
									</Heading>
									<Text mt={2} fontSize={"sm"} color='whiteAlpha.800'>
										You can earn $ZEX tokens by placing bids
										on any trading pair. Depends on how close
										your bid is to the current trading price
										and how long your bid stays in the order
										book
									</Text>
								</Box>
								<Box mt={8} maxW="400px">
									<AiOutlineAreaChart size={20}/>
									<Heading mt={4} size={"sm"} color="whiteAlpha.700">
										Trading volume
									</Heading>
									<Text mt={2} fontSize={"sm"} color='whiteAlpha.800'>
										You can also earn $ZEX tokens by having
										a high trading volume on any trading
										pair. The higher your trading volume,
										the more $ZEX tokens you earn.
									</Text>
								</Box>
							</Flex>

							
									
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