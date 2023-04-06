import DepositModal from "@/components/spot/balances/DepositModal";
import { DataContext } from "@/contexts/DataProvider";
import { CloseIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Flex,
	Heading,
	Text,
	SlideFade,
	Image,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { tickToPrecision } from "../../../utils";
import { ASSET_NAMES } from "../../../constants";
import TestTokens from "@/components/account/TestTokens";

export default function Balances({
	pair,
	isDepositOpen,
	onDepositOpen,
	onDepositClose,
	isWithdrawOpen,
	onWithdrawOpen,
	onWithdrawClose,
}: any) {
	const { tokens, tokenList, balances, account, pairs, trades } =
		useContext(DataContext);
	return (
		<>
			<Box px={4}>
				<Flex justify={"space-between"} pt={4}>
					<Heading size={"md"}>Account</Heading>

					<Flex gap={2}>
						{/* <DepositModal pair={pair}/> */}
						<Button
							size={"sm"}
							rounded={"full"}
							_hover={{ opacity: '0.6' }}
							bg={
								isDepositOpen
									? "background.100"
									: "background.400"
							}
							onClick={
								isDepositOpen ? onDepositClose : onDepositOpen
							}
						>
							<Text>Deposit</Text>
							{isDepositOpen && (
								<SlideFade
									in={isDepositOpen}
									offsetX={5}
									offsetY={0}
								>
									<Box ml={1} mr={-0.5}>
										<AiFillCloseCircle />
									</Box>
								</SlideFade>
							)}
						</Button>
						<Button
							size={"sm"}
							rounded={"full"}
							_hover={{ opacity: '0.6' }}
							bg={
								isWithdrawOpen
									? "background.100"
									: "background.400"
							}
							onClick={
								isWithdrawOpen
									? onWithdrawClose
									: onWithdrawOpen
							}
						>
							<Text>Withdraw</Text>
							{isWithdrawOpen && (
								<SlideFade
									in={isWithdrawOpen}
									offsetX={5}
									offsetY={0}
								>
									<Box ml={1} mr={-0.5}>
										<AiFillCloseCircle />
									</Box>
								</SlideFade>
							)}
						</Button>
					</Flex>
				</Flex>

				<Flex flexDir={"column"} gap={6} my={4} pb={6}>
					<TokenBalance token={pair?.symbol.split("_")[1]} />
					<TokenBalance token={pair?.symbol.split("_")[2]} />
				</Flex>
				{account && <Box pb={5}>
					<TestTokens/>
				</Box>}
			</Box>
		</>
	);
}

function TokenBalance({ token }: any) {
	const { tokens, tokenList, balances, account, pairs, trades } =
		useContext(DataContext);
	if (!token) return <></>;
	return (
		<Box>
			<Flex mt={2} gap={5} align="center" justify="space-between">
				<Flex align={"center"} gap={1.5}>
					<Image
						className="name-group"
						rounded={"full"}
						src={`https://oss.woo.network/static/symbol_logo/${token}.png`}
						w={8}
						h={8}
						zIndex={1}
						alt={token}
					/>
					<Box>
						<Text fontWeight={"medium"} fontSize={"md"}>
							{token}
						</Text>
						{account && <Flex gap={1}>
							<Text fontWeight={"normal"} fontSize={"sm"}>
								{balances[token]?.wallet ? (
									balances[token]?.wallet /
									10 ** tokens[token].decimals
								).toFixed(
									tickToPrecision(
										tokens[token].minimum_increment
									)
								) : '...'}
							</Text>

							<Text color={"whiteAlpha.600"} fontSize={"sm"}>
								in wallet
							</Text>
						</Flex> }
					</Box>
				</Flex>
				<Box textAlign={"right"}>
					<Text fontSize={"sm"} color="whiteAlpha.600">
						Available
					</Text>
					<Text fontSize={"sm"}>
					{account ? balances[token]?.holding ? Number(balances[token]?.holding).toFixed(
							tickToPrecision(tokens[token].minimum_increment)
						) : '...' : '-'}
					</Text>
				</Box>
			</Flex>
		</Box>
	);
}
