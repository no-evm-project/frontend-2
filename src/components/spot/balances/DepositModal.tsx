import { DataContext } from "@/contexts/DataProvider";
import {
	Button,
	Input,
	useDisclosure,
	Text,
	Select,
	Box,
	Image,
	Flex,
	Tab,
	InputGroup,
	InputLeftElement,
	Heading,
	Skeleton,
} from "@chakra-ui/react";
import React, { useContext } from "react";

import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from "@chakra-ui/react";
import { BN } from "bn.js";
import Big from "big.js";
import { ASSET_NAMES, CONTRACT_ID } from "../../../constants";
import { utils } from "near-api-js";
import NumberInputWithSlider from "@/components/inputs/NumberInputWithSlider";
import { tickToPrecision } from "../../../utils";
import { RiArrowDropDownLine } from "react-icons/ri";
import { motion } from "framer-motion";

export default function DepositModal({ _tokenSymbol }: any) {
	const { account, tokens, balances } = useContext(DataContext);
	const [amount, setAmount] = React.useState<string>("");
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isSelectOpen, setSelectOpen] = React.useState(false);
	const [loading, setLoading] = React.useState(false);

	const [tokenSymbol, setTokenSymbol] = React.useState<string>(
		_tokenSymbol ?? "NEAR"
	);

	const deposit = () => {
		if (tokenSymbol == "NEAR") {
			account?.wallet
				?.signAndSendTransaction({
					receiverId: CONTRACT_ID,
					actions: [
						{
							type: "FunctionCall",
							params: {
								methodName: "user_deposit_native_token",
								args: {
									broker_id: "zexe_dex",
								},
								gas: "100000000000000",
								deposit: utils.format.parseNearAmount(amount)!,
							},
						},
					],
				})
				.catch((err) => {
					console.log(err);
					setLoading(false);
				});
			setLoading(true);
			return;
		} else {
			account?.wallet
				?.signAndSendTransaction({
					receiverId: tokens[tokenSymbol].token_account_id,
					actions: [
						{
							type: "FunctionCall",
							params: {
								methodName: "ft_transfer_call",
								args: {
									receiver_id:
										"asset-manager.orderly.testnet",
									msg: '{"Deposit":{"broker_id":"zexe_dex"}}',
									amount: Big(amount)
										.mul(10 ** tokens[tokenSymbol].decimals)
										.toString(),
								},
								gas: "100000000000000",
								deposit: "1",
							},
						},
					],
				})
				.catch((err) => {
					console.log(err);
					setLoading(false);
				});
			setLoading(true);
		}
	};

	return (
		<>
			<Button size={"sm"} rounded={"full"} onClick={onOpen}>
				Deposit
			</Button>

			<Modal isCentered isOpen={isOpen} onClose={onClose}>
				<ModalOverlay bg="whiteAlpha.50" backdropFilter="blur(30px)" />
				<ModalContent bg={"background2"}>
					<ModalHeader>Deposit</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex flexDir={"column"} gap={6} mt={0}>
							<Box>
								<Text
									fontSize={"sm"}
									mb={2}
									color="whiteAlpha.700"
								>
									Asset
								</Text>

								<motion.nav
									initial={false}
									animate={isSelectOpen ? "open" : "closed"}
									className="menu"
									style={{ width: "100%", height: "100%" }}
									id="menu-list-123"
								>
									<Flex zIndex={2} h={"100%"}>
										<motion.button
											whileTap={{ scale: 0.97 }}
											onClick={() =>
												setSelectOpen(!isSelectOpen)
											}
											style={{
												width: "100%",
												height: "100%",
											}}
										>
											<Flex
												align={"center"}
												justify="space-between"
												bg="background2"
												h={"100%"}
											>
												<Flex gap={2} align="center">
													<Image
														className="name-group"
														rounded={"full"}
														src={`https://oss.woo.network/static/symbol_logo/${tokenSymbol}.png`}
														w={8}
														alt={tokenSymbol}
													/>
													<Heading
														fontSize={"xl"}
														className="name-group"
													>
														{
															ASSET_NAMES[
																tokenSymbol
															]
														}{" "}
														({tokenSymbol})
													</Heading>
												</Flex>

												<Flex
													align={"center"}
													color="whiteAlpha.700"
												>
													<Text fontSize={"sm"}>
														{isSelectOpen
															? "Tap to close"
															: "All Assets"}
													</Text>
													<motion.div
														variants={{
															open: {
																rotate: 180,
															},
															closed: {
																rotate: 0,
															},
														}}
														transition={{
															duration: 0.2,
														}}
														style={{
															originY: 0.55,
															marginBottom:
																isSelectOpen
																	? 4
																	: 0,
														}}
													>
														<RiArrowDropDownLine
															size={30}
														/>
													</motion.div>
												</Flex>
											</Flex>
										</motion.button>
									</Flex>

									<motion.ul
										variants={{
											open: {
												clipPath:
													"inset(0% 0% 0% 0% round 0px)",
												transition: {
													type: "spring",
													bounce: 0,
													duration: 0.4,
													delayChildren: 0.2,
													staggerChildren: 0.05,
												},
											},
											closed: {
												clipPath:
													"inset(10% 50% 90% 50% round 0px)",
												transition: {
													type: "spring",
													bounce: 0,
													duration: 0.3,
												},
											},
										}}
										style={{
											pointerEvents: isSelectOpen
												? "auto"
												: "none",
											listStyle: "none",
											display: "flex",
											flexDirection: "column",
											position: "fixed",
											width: "400px",
											padding: "12px",
											paddingBottom: "18px",
											backgroundColor: "#130B25",
											zIndex: 100,
											marginTop: "2px",
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
													transition: {
														duration: 0.1,
													},
												},
											}}
										>
											{Object.keys(balances).map(
												(token) => (
													<motion.li
														whileHover={{
															scale: 1.02,
														}}
														whileTap={{
															scale: 0.98,
														}}
														key={token}
														style={{
															marginBottom:
																"12px",
														}}
													>
														<Flex
															align={"center"}
															justify="space-between"
															bg="background2"
															h={"100%"}
															rounded={"lg"}
															p={2}
															onClick={() => {
																setTokenSymbol(
																	token
																);
																setSelectOpen(
																	false
																);
															}}
															cursor="pointer"
														>
															<Flex
																gap={2}
																align="center"
															>
																<Image
																	className="name-group"
																	rounded={
																		"full"
																	}
																	src={`https://oss.woo.network/static/symbol_logo/${token}.png`}
																	w={8}
																	alt={token}
																/>
																<Box>
																	<Heading
																		fontSize={
																			"lg"
																		}
																		className="name-group"
																	>
																		{
																			ASSET_NAMES[
																				token
																			]
																		}
																	</Heading>
																	<Text
																		fontSize={
																			"sm"
																		}
																	>
																		{token}
																	</Text>
																</Box>
															</Flex>
															<Box
																textAlign={
																	"right"
																}
															>
																<Text
																	fontSize={
																		"xs"
																	}
																>
																	Balance
																</Text>
																<Text
																	fontSize={
																		"sm"
																	}
																	color={
																		balances[
																			token
																		]
																			?.wallet ==
																		0
																			? "whiteAlpha.400"
																			: "white"
																	}
																>
																	{(
																		balances[
																			token
																		]
																			?.wallet /
																		10 **
																			tokens[
																				token
																			]
																				.decimals
																	).toFixed(
																		tickToPrecision(
																			tokens[
																				token
																			]
																				.minimum_increment
																		)
																	)}
																</Text>
															</Box>
														</Flex>
													</motion.li>
												)
											)}
										</motion.div>
									</motion.ul>
								</motion.nav>
							</Box>
							<Box>
								<Flex justify={"space-between"}>
									<Text fontSize={"sm"} mb={1}>
										Amount
									</Text>
									<Text fontSize={"xs"} mb={1}>
										Balance{" "}
										{(
											balances[tokenSymbol]?.wallet /
											10 ** tokens[tokenSymbol].decimals
										).toFixed(
											tickToPrecision(
												tokens[tokenSymbol]
													.minimum_increment
											)
										)}
									</Text>
								</Flex>

								<NumberInputWithSlider
									onUpdate={setAmount}
									max={
										balances[tokenSymbol]?.wallet /
										10 ** tokens[tokenSymbol].decimals
									}
									value={amount}
									tick={tokens[tokenSymbol].minimum_increment}
								/>
							</Box>
						</Flex>
					</ModalBody>

					<ModalFooter>
						<Button
							width={"100%"}
							loadingText="Sign the transaction"
							isLoading={loading}
							_hover={{ opacity: "0.7" }}
							colorScheme="primary"
							color={"white"}
							mb={2}
							onClick={deposit}
						>
							Deposit
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
