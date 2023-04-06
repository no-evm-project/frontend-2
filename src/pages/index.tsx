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
import { useContext } from "react";
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

const Index = () => {
	const {volumeStat} = useContext(DataContext);

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
				h={'100vh'}
			>
				<Box
					bgImage="/Rectangle2.png"
					bgRepeat={"no-repeat"}
					bgSize={{ xs: "0", sm: "1000px", md: "contain" }}
					bgPosition={"center bottom"}
					h={'100vh'}
				>
					<Box mr={"10%"} ml={"10%"}>
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

						<Divider mt={{ xs: 16, sm: 20, md: 28 }} mb={10} />
					</Box>
					<Box py={0} pb={20}>
						<Flex ml="10%" gap={10}>
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
					</Box>
				</Box>
			</Flex>
		</>
	);
};

export default Index;
