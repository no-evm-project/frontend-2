import {
	Text,
	Code,
	List,
	ListIcon,
	Image,
	ListItem,
	Flex,
	Button,
	Box,
	Divider,
	Heading,
} from "@chakra-ui/react";

import { useColorMode } from "@chakra-ui/react";
import Link from "next/link";
import Head from "next/head";
import {
	BsCurrencyExchange,
	BsDiscord,
	BsGithub,
	BsTwitter,
} from "react-icons/bs";
import { RiExchangeFundsFill } from "react-icons/ri";
import { GiBank, GiCardExchange } from "react-icons/gi";
import { useContext, useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import '@fontsource/silkscreen'

const featuresTitle = {
	fontSize: "xl",
	fontWeight: "bold",
	mt: 2,
	// fontFamily: "Poppins",
};

const featuresText = {
	fontSize: "sm",
	// fontFamily: "Poppins",
};

const featuresIcon = {
	size: "25",
};

import { NextSeo } from "next-seo";
import SocialFollow from "@/components/SocialFollow";
import { DataContext } from '@/contexts/DataProvider';
import { useEffect } from 'react';
import { dollarFormatter } from '../utils';
import { ASSET_NAMES } from '../constants';

const Index = () => {
	const {volumeStat, initMarket} = useContext(DataContext);

	useEffect(() => {
		initMarket();
	}, [])

	const dividerStyle = {
		borderColor: { xs: "transparent", sm: "transparent", md: "#E50EC0" },
		mx: 4,
		my: 5,
		height: "130px",
		display: { xs: "none", sm: "block" },
		orientation: "vertical",
	};

	return (
		<>
			<NextSeo
				title="ZEXE: Orderbook DEX with Spot and Derivatives Market"
				description="Zexe is an Orderbook DEX (decentralised exchange) with Spot and Derivatives market. It is a fully decentralized orderbook exchange with a focus on low fees and high liquidity."
				canonical="https://www.zexe.io/"
				openGraph={{
					url: "https://www.zexe.io/trade",
					title: "Trade on Zexe",
					description:
						"Zexe is an Orderbook DEX (decentralised exchange) with Spot and Derivatives market. It is a fully decentralized orderbook exchange with a focus on low fees and high liquidity.",
					images: [
						// {
						// 	url: "https://www.example.ie/og-image-01.jpg",
						// 	width: 800,
						// 	height: 600,
						// 	alt: "Og Image Alt",
						// 	type: "image/jpeg",
						// },
						// { url: "https://www.example.ie/og-image-03.jpg" },
						// { url: "https://www.example.ie/og-image-04.jpg" },
					],
					siteName: "ZEXE",
				}}
				twitter={{
					handle: "@zexeio",
					site: "@zexeio",
					cardType: "summary_large_image",
				}}
			/>
			<Head>
				<title>
					ZEXE | Buy and Sell Crypto with Low Fees and High Liquidity
				</title>
				<link rel="icon" type="image/x-icon" href="/x.png"></link>
			</Head>

			<Flex
				flexDir="column"
				bgColor={"#09001F"}
				bgImage="/Rectangle.png"
				bgRepeat={"no-repeat"}
				bgSize={{ xs: "0", sm: "contain", md: "contain" }}
				bgPosition={"center top"}
				// h={'100vh'}
			>
				<Box
					bgImage="/Rectangle2.png"
					bgRepeat={"no-repeat"}
					bgSize={{ xs: "0", sm: "1000px", md: "contain" }}
					bgPosition={"center bottom"}
				>
					<Box mr={"10%"} ml="10%">
					<Box >
						<Flex align={"center"} justify="space-between">
							<Text
								fontFamily={"Silkscreen"}
								fontSize={"56.53px"}
								letterSpacing="-10px"
								color={"#F60DC9"}
								mt={10}
							>
								zexe
							</Text>
							<Box mt={4}>
								<SocialFollow />
							</Box>
						</Flex>

						<Flex
							flexDir={"column"}
							justify={"center"}
							mt={{ xs: "80px", sm: "120px", md: "180px" }}
							mb={"60px"}
							fontSize={{ xs: "38", sm: "40px", md: "68.5px" }}
							lineHeight={"121%"}
							mr={"10%"}
						>
							<Text fontWeight="bold" fontFamily={"BG"}>ORDERBOOK DEX</Text>
							<Text
								className={"stroke"}
								color="transparent"
								fontWeight="bold"
								fontFamily={"BG"}
							>
								WITH SPOT AND
							</Text>
							<Text fontWeight="bold" fontFamily={"BG"}>DERIVATIVES MARKETS</Text>
						</Flex>

						<Flex wrap={"wrap"} gap={5}>
							<Box w={"200px"} my={5}>
								<BsCurrencyExchange {...featuresIcon} />
								<Text {...featuresTitle}>Spot Trading</Text>
								<Box
									h={"2px"}
									mt={2}
									mb={4}
									w={"100%"}
									bgGradient="linear(to-r, #F60DC9, #1AE5C8)"
								></Box>
								<Text {...featuresText}>
									Market and limit orders with conditional
									execution
								</Text>
							</Box>

							<Divider {...dividerStyle} orientation="vertical" />

							<Box w={"250px"} my={5}>
								<RiExchangeFundsFill {...featuresIcon} />
								<Text {...featuresTitle}>Margin Trading</Text>
								<Box
									h={"2px"}
									mt={2}
									mb={4}
									w={"100%"}
									bgGradient="linear(to-r, #F60DC9, #1AE5C8)"
								></Box>
								<Text {...featuresText}>
									With upto 10x leverage on all major tokens
								</Text>
							</Box>

							<Divider {...dividerStyle} orientation="vertical" />

							<Box w={"200px"} my={5}>
								<GiCardExchange {...featuresIcon} />
								<Text {...featuresTitle}>
									Perpetual Futures
								</Text>
								<Box
									h={"2px"}
									mt={2}
									mb={4}
									w={"100%"}
									bgGradient="linear(to-r, #F60DC9, #1AE5C8)"
								></Box>
								<Text {...featuresText}>
									With upto 100x leverage for limitless
									trading
								</Text>
							</Box>

							<Divider {...dividerStyle} orientation="vertical" />

							<Box w={"200px"} my={5}>
								<GiBank {...featuresIcon} />
								<Text {...featuresTitle}>Money Market</Text>
								<Box
									h={"2px"}
									mt={2}
									mb={4}
									w={"100%"}
									bgGradient="linear(to-r, #F60DC9, #1AE5C8)"
								></Box>
								<Text {...featuresText}>
									Lend/Borrow assets with attractive yields
								</Text>
							</Box>
						</Flex>

						<Flex gap={2} mt={"60px"} mb={"20px"} wrap={"wrap"}>
							<Link href={"/spot"} as='/spot'>
								<Button
									size={"lg"}
									bgColor="#E50EC0"
									color="white"
									// color={"black"}
									_hover={{ opacity: "0.6" }}
									disabled={true}
								>
									Trade Now
								</Button>
							</Link>
							<Link
								href={
									"https://drive.google.com/file/d/1Jkc0QIvCIiMqdFbl0g39NF5bQIF0cnmZ/view?usp=sharing"
								}
								target="_blank"
							>
								<Button size={"lg"} variant={"outline"}>
									Learn More
								</Button>
							</Link>
						</Flex>

					</Box>
					<Box py={0} bg='whiteAlpha.200' mx='-12%' px={'11%'} opacity='0.8' mb={20}>
					<Divider mt={{ xs: 16, sm: 20, md: 28 }} mb={10} />

						<Flex  gap={10}>
							<Flex align={"center"} gap={4} color="gray.400">
								<Image
									src="/built_on_rev.png"
									alt="zexe"
									rounded={"full"}
									height={8}
								/>
							</Flex>

							<Divider
								orientation="vertical"
								h={12}
								borderColor={"white"}
							/>

							<Flex align={"center"} gap={4} fontFamily='Poppins'>
								<Image
									src="https://pbs.twimg.com/profile_images/1610066785025523713/2iij3ydV_400x400.jpg"
									alt="zexe"
									rounded={"full"}
									height={12}
								/>
								<Box>
									<Text
										fontSize={"xs"}
										color="gray.300"
										mb={0}
									>
										Powered by
									</Text>
									<Text
										fontSize={"xl"}
										color="white"
										fontWeight={"bold"}
									>
										Orderly Network
									</Text>
								</Box>
							</Flex>
						</Flex>

						<Divider mt={10}/>
					</Box>

					<Flex justify={'space-between'} gap={20}>
						<Box w={'50%'} >
							<Heading>Leading DEX on NEAR</Heading>
							<Text mt={6}>
								ZEXE is the leading exchange on NEAR. We offer
								competitive fees, high liquidity, and a
								transparent and secure trading experience.
							</Text>

						<StatGroup justifyContent={'start'} mt={20}>
							<VolumeStat title='Volume 7d' value={volumeStat.volume_last_7_days} compare={volumeStat.volume_last_30_days/4} />
							<VolumeStat title='Volume 30d' value={volumeStat.volume_last_30_days} compare={volumeStat.volume_ytd/12}/>
							<VolumeStat title='Volume YTD' value={volumeStat.volume_ytd} compare={0} />
						</StatGroup>

						
						</Box>
						<Box my={0} w='40%'>
							<TokensTable/>
						</Box>
					</Flex>
					
					<Flex mt={20} mb={20} justify='space-between' align={'center'}>
						<Box>
					<Image src='/x.png' alt='zexe' w={20} h={20} />
					<Text mt={5} fontSize={'xs'}>Copyright @ 2023</Text>
					<Text mt={2} color='whiteAlpha.700' fontSize={'xs'} maxW='400px'>
						We are a community of traders, developers, and
						entrepreneurs; building the future of
						DeFi.
					</Text>
						</Box>
					<Flex flexDir={'column'} gap={4} p={6}>
							<Link href={'https://discord.gg/wwzNMndQr6'} target='_blank'>
							<Flex align={'center'} gap={2}>
							<FaDiscord size={30}/>
							<Heading size={'sm'}>
							Join Our Community On Discord
							</Heading>
							</Flex>
							</Link>

							<Link href={'https://twitter.com/zexeio'} target='_blank'>
							<Flex align={'center'} gap={2}>
							<FaTwitter size={30}/>
							<Heading size={'sm'}>
							Follow Us On Twitter
							</Heading>
							</Flex>
							</Link>
						</Flex>
					</Flex>
					</Box>
				</Box>
			</Flex>
		</>
	);
};

import {
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	StatArrow,
	StatGroup,
  } from '@chakra-ui/react'


  import {
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
	TableContainer,
  } from '@chakra-ui/react'
import { FaDiscord, FaTwitter } from "react-icons/fa";

function VolumeStat ({title, value, compare}: any) {
	return (
		<Stat>
			<StatLabel>{title}</StatLabel>
			<StatNumber>{dollarFormatter.format(value)}</StatNumber>
			<StatHelpText>
				<StatArrow type={value > compare ? "increase" : "decrease"} />
				{(100*(value - compare) / value).toFixed(2)} %
			</StatHelpText>
		</Stat>
	)
}

function TokensTable ({}) {
	const { tokenList, tokens, trades } = useContext(DataContext);

	return (<>
		<TableContainer bg={'whiteAlpha.50'} border='2px' borderColor={'whiteAlpha.100'}>
			<Table variant='simple'>
				<TableCaption>Note: Testnet Figures</TableCaption>
				<Thead>
				<Tr>
					<Th>Market</Th>
					<Th isNumeric>Price</Th>
				</Tr>
				</Thead>
				<Tbody>
					{tokenList.map((tokenSymbol: any, index: number) => (
						<Tr key={index}>
							<Td>
								<Flex gap={2}>
								<Image
											className="name-group"
											rounded={"full"}
											src={`https://oss.woo.network/static/symbol_logo/${tokenSymbol}.png`}
											w={9}
											h={9}
											alt={tokenSymbol}
										/>
										<Box>
											<Text fontFamily={'Space Grotesk'}>{ASSET_NAMES[tokenSymbol]}</Text>
											<Text fontSize={'sm'}>{tokenSymbol}</Text>
										</Box>
								</Flex>
								</Td>
							<Td isNumeric>{dollarFormatter.format(trades[`SPOT_${tokenSymbol}_USDC`]?.[0]?.executed_price ?? 1)}</Td>
						</Tr>
					))}
				
				</Tbody>
			</Table>
		</TableContainer>
	</>)
}
export default Index;
