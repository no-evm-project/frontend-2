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
	Tag,
} from "@chakra-ui/react";

import { useColorMode } from "@chakra-ui/react";
import Link from "next/link";
import Head from "next/head";
import {
	BsCurrencyExchange,
	BsDiscord,
	BsFillLightningChargeFill,
	BsGithub,
	BsGoogle,
	BsTwitter,
} from "react-icons/bs";
import { RiExchangeFundsFill } from "react-icons/ri";
import { GiBank, GiCardExchange } from "react-icons/gi";
import { useContext, useState } from "react";
import { TbGasStationOff } from "react-icons/tb";
import "@fontsource/silkscreen";

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
import { DataContext } from "@/contexts/DataProvider";
import { useEffect } from "react";
import { dollarFormatter } from "../utils";
import { ASSET_NAMES } from "../constants";

const Index = () => {
	const { networkStatus, initMarket } = useContext(DataContext);

	useEffect(() => {
		initMarket();
	}, []);

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
				bgSize={"contain"}
				bgPosition={"center top"}
			>
				<Box
					bgImage="/Rectangle2.png"
					bgRepeat={"no-repeat"}
					bgSize={ "contain" }
					bgPosition={"center bottom"}
				>
					<Box mr={"10%"} ml="10%">
						<Box>
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
								fontSize={{
									xs: "38",
									sm: "40px",
									md: "68.5px",
								}}
								lineHeight={"121%"}
								mr={"10%"}
							>
								<Text fontWeight="bold" fontFamily={"BG"}>
									ORDERBOOK DEX
								</Text>
								<Text
									className={"stroke"}
									color="transparent"
									fontWeight="bold"
									fontFamily={"BG"}
								>
									WITH SPOT AND
								</Text>
								<Text fontWeight="bold" fontFamily={"BG"}>
									DERIVATIVES MARKETS
								</Text>
							</Flex>

							<Flex wrap={"wrap"} gap={5}>
								<MainFeature icon={<BsCurrencyExchange {...featuresIcon} />} title='Spot Trading' text='Market and limit orders with conditional execution' />

								<Divider
									{...dividerStyle}
									orientation="vertical"
								/>

								<MainFeature icon={<RiExchangeFundsFill {...featuresIcon} />} title='Margin Trading' text='With upto 10x leverage on all major tokens' />


								<Divider
									{...dividerStyle}
									orientation="vertical"
								/>

								<MainFeature icon={<GiCardExchange {...featuresIcon} />} title='Perpetual Futures' text='With upto 100x leverage for limitless trading' />

								<Divider
									{...dividerStyle}
									orientation="vertical"
								/>

								<MainFeature icon={<GiBank {...featuresIcon} />} title='Money Market' text='Lend/Borrow assets with attractive yields' />

							</Flex>

							<Flex gap={2} mt={"60px"} wrap={"wrap"}>
								<Link href={"/spot"} as="/spot">
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

						<Box
							bg="whiteAlpha.200"
							mx="-12%"
							px={"11%"}
							mb={20}
							bgImage="/Rectangle3.png"
							bgRepeat={"no-repeat"}
							bgPosition={"center"}
							bgSize={'cover'}
						>
							<Divider mt={{ xs: 16, sm: 16, md: 32 }} mb={10} />

							<Flex
								flexDir={{
									xs: "column",
									sm: "row",
									md: "row",
								}}
								gap={10}
							>
								<Flex align={"center"} gap={4} color="gray.400">
									<Image
										src="/built_on_rev.png"
										alt="zexe"
										rounded={"full"}
										height={9}
									/>
								</Flex>

								<Divider
									orientation="vertical"
									h={12}
									display={{ xs: 'none', sm: 'block', md: 'block' }}
									borderColor={"white"}
								/>

								<Divider
									orientation="horizontal"
									display={{ xs: 'block', sm: 'none', md: 'none' }}
									borderColor={"white"}
								/>

								<Flex
									align={"center"}
									gap={4}
									fontFamily="Poppins"
								>
									<Image
										src="https://pbs.twimg.com/profile_images/1610066785025523713/2iij3ydV_400x400.jpg"
										alt="zexe"
										rounded={"full"}
										height={14}
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

							<Divider mt={10} />
						</Box>

						<Flex
							flexDir={{ xs: "column", sm: "column", md: "row" }}
							justify={"space-between"}
							gap={10}
						>
							<Box w={{ xs: "100%", sm: "100%", md: "60%" }}>
								<Heading>
									User First <br /> Trading Experience
								</Heading>
								<Text mt={6}>
									Trade on ZEXE with a simple, intuitive
									and easy to use interface, on web and mobile.
									Bringing the power of DeFi to the masses.
								</Text>

								<Flex gap={10} my={24} wrap="wrap">
									<Feature
										icon={<TbGasStationOff size={"30"} />}
										title="Gas Less"
										text="
									Trade on ZEXE without paying any gas fees.
								"
									/>
									<Feature
										icon={
											<BsFillLightningChargeFill
												size={"30"}
											/>
										}
										title="Lightening Fast"
										text="
									State of the art matching engine scaling throughput beyond L1s
								"
									/>
									<Feature
										icon={<BsGoogle size={"30"} />}
										title="Account Abstraction"
										text="
									Create accounts with Social Sign In (Google/Twitter), or Metamask
								"
										isComingSoon
									/>
									<Feature
										icon={<IoIosAppstore size={"30"} />}
										title="Mobile First"
										text="
									Trade on the go with our mobile app for Android and iOS
								"
										isComingSoon
									/>
								</Flex>
							</Box>
							<Box w={{ xs: "100%", sm: "100%", md: "40%" }}>
								{networkStatus.status == 0 ? <TokensTable /> : <>
										<Box>
											<Text textAlign={'center'}>{networkStatus.msg}</Text>
										</Box>
								</>}
							</Box>
						</Flex>

						<Flex
							mt={20}
							mb={20}
							justify="space-between"
							align={"center"}
						>
							<Box>
								<Image src="/x.png" alt="zexe" w={20} h={20} />
								<Text mt={5} fontSize={"xs"}>
									Copyright @ 2023
								</Text>
								<Text
									mt={2}
									color="whiteAlpha.700"
									fontSize={"xs"}
									maxW="400px"
								>
									ZEXE.io All Rights Reserved. Community of traders, developers,
									and entrepreneurs; building the future of
									DeFi.
								</Text>
							</Box>
							<Flex flexDir={"column"} gap={4} p={6}>
								<Link
									href={"https://discord.gg/wwzNMndQr6"}
									target="_blank"
								>
									<Flex align={"center"} gap={2}>
										<FaDiscord size={30} />
										<Heading size={"sm"}>
											Join Our Community On Discord
										</Heading>
									</Flex>
								</Link>

								<Link
									href={"https://twitter.com/zexeio"}
									target="_blank"
								>
									<Flex align={"center"} gap={2}>
										<FaTwitter size={30} />
										<Heading size={"sm"}>
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

function MainFeature({ icon, title, text }: any) {
	return (
		<Box w={"200px"} my={5}>
			{icon}
			<Text {...featuresTitle}>{title}</Text>
			<Box
				h={"2px"}
				mt={2}
				mb={4}
				w={"100%"}
				bgGradient="linear(to-r, #F60DC9, #1AE5C8)"
			></Box>
			<Text {...featuresText}>{text}</Text>
		</Box>
	);
}
function Feature({ icon, title, text, isComingSoon = false }: any) {
	return (
		<>
			<Box maxW={"280px"}>
				<Flex gap={3}>
					{icon}
					{isComingSoon && (
						<Tag bg={"background.400"}>Coming Soon</Tag>
					)}
				</Flex>
				<Heading mt={4} mb={2} size={"md"}>
					{title}
				</Heading>
				<Text fontSize={"md"}>{text}</Text>
			</Box>
		</>
	);
}

import {
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	StatArrow,
	StatGroup,
} from "@chakra-ui/react";

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
} from "@chakra-ui/react";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import ComingSoon from "../components/account/ComingSoon";
import { IoIosAppstore } from "react-icons/io";

function VolumeStat({ title, value, compare }: any) {
	return (
		<Stat size={'sm'}>
			<StatLabel fontSize={'xs'}>{title}</StatLabel>
			<StatNumber fontSize={'lg'}>{dollarFormatter.format(value)}</StatNumber>
			<StatHelpText fontSize={'xs'}>
				<StatArrow type={value > compare ? "increase" : "decrease"} />
				{((100 * (value - compare)) / value).toFixed(2)} %
			</StatHelpText>
		</Stat>
	);
}

const TableThStyle = {
	pt: 2,
	borderColor: 'whiteAlpha.300'
}

const TableTdStyle = {
	borderColor: 'whiteAlpha.200',
	py: '3'
}


function TokensTable({}) {
	const { tokenList, tickers, trades, volumeStat } = useContext(DataContext);

	return (
		<>
			<Heading size={"sm"} mb={4} color="whiteAlpha.800">
				All Markets
			</Heading>
			<TableContainer
				bg={"whiteAlpha.50"}
				border="2px"
				borderColor={"whiteAlpha.100"}
			>
				<Table variant="simple" size={'sm'}>
					<TableCaption>
						<Text>Note: Testnet Figures</Text>

						<StatGroup justifyContent={"start"} my={5} gap={10}>
							<VolumeStat
								title="Volume 7d"
								value={volumeStat.volume_last_7_days}
								compare={volumeStat.volume_last_30_days / 4}
							/>
							<VolumeStat
								title="Volume 30d"
								value={volumeStat.volume_last_30_days}
								compare={volumeStat.volume_ytd / 12}
							/>
							<VolumeStat
								title="Volume YTD"
								value={volumeStat.volume_ytd}
								compare={0}
							/>
						</StatGroup>
					</TableCaption>
					<Thead>
						<Tr >
							<Th {...TableThStyle}>Market</Th>
							<Th {...TableThStyle}>Price</Th>
							<Th {...TableThStyle} isNumeric>24H Volume</Th>
						</Tr>
					</Thead>
					<Tbody>
						{tokenList.map((tokenSymbol: any, index: number) => (
							<Tr key={index}>
								<Td {...TableTdStyle}>
									<Flex gap={2}>
										<Image
											className="name-group"
											rounded={"full"}
											src={`https://oss.woo.network/static/symbol_logo/${tokenSymbol}.png`}
											w={7}
											h={7}
											alt={tokenSymbol}
										/>
										<Box>
											<Text fontFamily={"Space Grotesk"}>
												{ASSET_NAMES[tokenSymbol]}
											</Text>
											<Text fontSize={"sm"}>
												{tokenSymbol}
											</Text>
										</Box>
									</Flex>
								</Td>
								<Td {...TableTdStyle}>
									{dollarFormatter.format(
										trades[`SPOT_${tokenSymbol}_USDC`]?.[0]
											?.executed_price ?? 0
									)}
								</Td>
								<Td {...TableTdStyle} isNumeric>
									{dollarFormatter.format(
										(tickers[`SPOT_${tokenSymbol}_USDC`]?.volume ?? 0) * (trades[`SPOT_${tokenSymbol}_USDC`]?.[0]?.executed_price ?? 0)
									)}
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</TableContainer>
		</>
	);
}
export default Index;
