import React from "react";
import { DataContext } from "@/contexts/DataProvider";
import {
	Box,
	Divider,
	Flex,
	Heading,
	Input,
	Skeleton,
	Text,
	Image,
	InputLeftElement,
	InputGroup,
	TabPanel,
	TabPanels,
	TabList,
	Tab,
	Tabs,
} from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import router, { useRouter } from "next/router";
import { useContext } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { AppDataContext } from "@/contexts/AppData";
import { SearchIcon } from "@chakra-ui/icons";
import { ASSET_NAMES } from "../../../constants";
import { SlideFade } from '@chakra-ui/react';

const itemVariants: Variants = {
	open: {
		opacity: 1,
		y: 0,
		transition: { type: "spring", stiffness: 300, damping: 24 },
	},
	closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

const DeFiTokenSymbols = ["REF", "WOO"];
const BlockchainSymbols = ["ETH", "WBTC", "AURORA", "NEAR"];
const GamingSymbols = ["SWEAT"];

const tabStyle = {
	rounded: 0,
}

export default function TokenSelector({ pair, headingSize = '2xl' }: any) {
	const [isOpen, setIsOpen] = React.useState(false);
	const { pairs } = useContext(DataContext);

	window.addEventListener("click", function (e) {
		if (
			!document.getElementById("menu-list-123")?.contains(e.target as any)
		) {
			// if element class is 'name-group' then do nothing
			if (!(e.target as any).className?.includes) return;
			if ((e.target as any).className?.includes("name-group")) return;
			else setIsOpen(false);
		}
	});

	return (
		<Flex justify={"center"} flexDir="column" h={"100%"}>
			<motion.nav
				initial={false}
				animate={isOpen ? "open" : "closed"}
				className="menu"
				style={{ width: "100%", height: "100%" }}
				id="menu-list-123"
			>
				<Flex zIndex={2} h={"100%"}>
					<motion.button
						whileTap={{ scale: 0.97 }}
						onClick={() => setIsOpen(!isOpen)}
						style={{ width: "100%", height: "100%" }}
					>
						<Flex
							align={"center"}
							justify="space-between"
							bg="background.600"
							h={"100%"}
							pl={5}
							pr={2}
						>
							{!isOpen ? (
								pair ? (
									<Flex gap={2} align="center" className="name-group">
										<Image
											className="name-group"
											rounded={"full"}
											src={`https://oss.woo.network/static/symbol_logo/${
												pair.symbol
													.replace("SPOT_", "")
													.split("_")[0]
											}.png`}
											w={8}
											zIndex={1}
											alt={pair.symbol}
										/>
										<Heading
											fontSize={headingSize}
											className="name-group"
										>
											{pair.symbol
												.replace("SPOT_", "")
												.split("_")
												.join("-")}
										</Heading>
									</Flex>
								) : (
									<Skeleton
										height="30px"
										width="200px"
										rounded={0}
									/>
								)
							) : (
								<SlideFade in={isOpen} offsetY="20px">
									<Flex gap={2} align="center">
										<Heading fontSize={headingSize}>Markets</Heading>
									</Flex>
								</SlideFade>
							)}

							<Flex align={"center"} color="whiteAlpha.600">
								<Text fontSize={"sm"}>
									{isOpen ? "Tap to close" : "View All"} 
									{/* All Markets */}
								</Text>
								<motion.div
									variants={{
										open: { rotate: 180 },
										closed: { rotate: 0 },
									}}
									transition={{ duration: 0.2 }}
									style={{
										originY: 0.55,
										marginBottom: isOpen ? 4 : 0,
									}}
								>
									<RiArrowDropDownLine size={30} />
								</motion.div>
							</Flex>
						</Flex>
					</motion.button>
				</Flex>

				<motion.ul
					variants={{
						open: {
							clipPath: "inset(0% 0% 0% 0% round 0px)",
							transition: {
								type: "spring",
								bounce: 0,
								duration: 0.4,
								delayChildren: 0.2,
								staggerChildren: 0.05,
							},
						},
						closed: {
							clipPath: "inset(10% 50% 90% 50% round 0px)",
							transition: {
								type: "spring",
								bounce: 0,
								duration: 0.3,
							},
						},
					}}
					style={{
						pointerEvents: isOpen ? "auto" : "none",
						listStyle: "none",
						display: "flex",
						flexDirection: "column",
						position: "relative",
						width: '100%',
						// height: '72vh',
						padding: "12px",
						backgroundColor: "#1A0F30",
						border: "1px solid #2A1652",
						zIndex: 100,
					}}
				>
					<motion.div
						variants={{
							open: {
								opacity: 1,
								y: 0,
								transition: {
									ease: "easeOut",
									duration: 0.1,
								},
							},
							closed: {
								opacity: 0,
								y: 20,
								transition: { duration: 0.1 },
							},
						}}
					>
						<InputGroup>
							<InputLeftElement pointerEvents="none">
								<Flex mt={"50%"}>
									<SearchIcon color="gray.300" />
								</Flex>
							</InputLeftElement>
							<Input
								placeholder="Search Crypto Pairs"
								bg={"background.400"}
								border="0"
								my={2}
								h="44px"
								_selected={{ border: "0" }}
								rounded={0}
							/>
						</InputGroup>

						<Tabs isFitted size={"sm"} colorScheme='primary'>
							<TabList mx={0} mr={2} mb={2}>
								<Tab {...tabStyle}>
									All
								</Tab>
								<Tab {...tabStyle}>
									DeFi
								</Tab>
								<Tab {...tabStyle}>
									Blockchain
								</Tab>
								<Tab {...tabStyle}>
									Gaming
								</Tab>
								<Tab {...tabStyle} isDisabled={true}>
									More <RiArrowDropDownLine size={"25px"} />
								</Tab>
							</TabList>
							<TabPanels>
								<TabPanel p={0} py={2} m={0}>
									<ListedPairs
										pairs={pairs}
										setIsOpen={setIsOpen}
									/>
								</TabPanel>
								<TabPanel px={0} py={2} m={0}>
									<ListedPairs
										pairs={pairs.filter((pair: any) =>
											DeFiTokenSymbols.includes(
												pair.symbol.split("_")[1]
											)
										)}
										setIsOpen={setIsOpen}
									/>
								</TabPanel>
								<TabPanel px={0} py={2} m={0}>
									<ListedPairs
										pairs={pairs.filter((pair: any) =>
											BlockchainSymbols.includes(
												pair.symbol.split("_")[1]
											)
										)}
										setIsOpen={setIsOpen}
									/>
								</TabPanel>
								<TabPanel px={0} py={2} m={0}>
									<ListedPairs
										pairs={pairs.filter((pair: any) =>
											GamingSymbols.includes(
												pair.symbol.split("_")[1]
											)
										)}
										setIsOpen={setIsOpen}
									/>
								</TabPanel>
								<TabPanel px={0} py={2} m={0}></TabPanel>
							</TabPanels>
						</Tabs>
					</motion.div>
				</motion.ul>
			</motion.nav>
		</Flex>
	);
}

const ListedPairs = ({ pairs, setIsOpen }: any) => {
	const { trades, tickers } = useContext(DataContext);
	const { setExchangeRate } = useContext(AppDataContext);

	return (
		<>
			{pairs.map((_pair: any, index: number) => {
				return (
					<motion.li
						variants={itemVariants}
						onClick={() => {
							setIsOpen(false);
							setExchangeRate(0);
							router.push(
								`/spot/${_pair.symbol.replace("SPOT_", "")}`
							);
						}}
						key={index}
					>
						<Flex
							_hover={{ bg: "background.500" }}
							cursor="pointer"
							mx={-3}
							py={4}
							px={4}
							justify="space-between"
						>
							<Flex align={"center"} gap={2}>
								<Flex>
									<Image
										rounded={"full"}
										src={`https://oss.woo.network/static/symbol_logo/${
											_pair.symbol
												.replace("SPOT_", "")
												.split("_")[0]
										}.png`}
										w={8}
										alt={_pair.symbol}
									/>
								</Flex>
								<Box>
									<Heading
										fontSize={"md"}
										fontFamily="Space Grotesk"
									>
										{
											ASSET_NAMES[
												_pair.symbol
													.replace("SPOT_", "")
													.split("_")[0]
											]
										}
									</Heading>
									<Text
										fontSize={"sm"}
										mt="2px"
										color={"whiteAlpha.600"}
									>
										{_pair.symbol
											.replace("SPOT_", "")
											.split("_")
											.join("/")}
									</Text>
								</Box>
							</Flex>

							<Box textAlign={"right"}>
								<Text fontWeight="medium">
									{(trades[_pair.symbol]?.[0]
												?.executed_price
										?? 0
									).toFixed(
										(_pair?.quote_tick ?? 0.001).toString()
											.length - 2
									)}
								</Text>

								{tickers[_pair.symbol] && (
									<Text
										fontSize={"sm"}
										color={
											trades[_pair.symbol]?.[0]
												?.executed_price >=
											tickers[_pair.symbol].open
												? "buy.700"
												: "sell.400"
										}
									>
										{(
											(100 *
												(trades[_pair.symbol]?.[0]
													?.executed_price -
													tickers[_pair.symbol]
														.open)) /
														tickers[_pair.symbol]
														.open
										).toFixed(2) + "%"}
									</Text>
								)}
							</Box>
						</Flex>
					</motion.li>
				);
			})}
		</>
	);
};
