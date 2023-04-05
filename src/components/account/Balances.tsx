import { DataContext } from "@/contexts/DataProvider";
import React, { useContext } from "react";

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
	Button,
	Text,
	Flex,
	Image,
	Box,
} from "@chakra-ui/react";
import { ASSET_NAMES, FAUCET } from "@/constants";
import { transactions } from "near-api-js";
import Big from "big.js";
import { dollarFormatter, tickToPrecision } from "../../utils";
import DepositModal from "@/components/spot/balances/DepositModal";
import WithdrawModal from "../spot/balances/WithdrawModal";
import TestTokens from "./TestTokens";

export default function Balances({ tokenBalances }: any) {
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

	return (
		<TableContainer>
			<Table variant="simple">
				<TableCaption my={5}>
					<TestTokens />
				</TableCaption>
				<Thead>
					<Tr>
						<Th borderColor={"whiteAlpha.200"}>Asset</Th>
						<Th borderColor={"whiteAlpha.200"}>Trading Account</Th>
						<Th borderColor={"whiteAlpha.200"}>In Order</Th>
						<Th borderColor={"whiteAlpha.200"}>Wallet</Th>

						<Th borderColor={"whiteAlpha.200"} isNumeric>
							
						</Th>
					</Tr>
				</Thead>
				<Tbody>
					{tokenList.map((tokenSymbol: string, index: number) => {
						return (
							<Tr key={index}>
								<Td borderColor={"whiteAlpha.200"}>
									<Flex gap={2}>
										<Image
											className="name-group"
											rounded={"full"}
											src={`https://oss.woo.network/static/symbol_logo/${tokenSymbol}.png`}
											w={10}
											alt={tokenSymbol}
										/>
										<Box>
											<Text>
												{ASSET_NAMES[tokenSymbol]}
											</Text>
											<Text fontSize={"sm"}>
												{tokenSymbol}
											</Text>
										</Box>
									</Flex>
								</Td>
								<Td borderColor={"whiteAlpha.200"}>
									<Text
										color={
											balances[tokenSymbol]?.holding > 0
												? "white"
												: "whiteAlpha.700"
										}
									>
										{Big(
											balances[tokenSymbol]?.holding ?? 0
										).toString()}{" "}
										{balances[tokenSymbol]?.holding > 0 &&
											tokenSymbol}
									</Text>
								</Td>
								<Td
									borderColor={"whiteAlpha.200"}
									color={
										balances[tokenSymbol]?.pending_short < 0
											? "white"
											: "whiteAlpha.700"
									}
								>
									{Big(
										balances[tokenSymbol]?.pending_short ??
											0
									)
										.abs()
										.toString()}{" "}
									{balances[tokenSymbol]?.pending_short < 0 &&
										tokenSymbol}
								</Td>
								<Td borderColor={"whiteAlpha.200"}>
									
											<Text>
												{Big(
													balances[tokenSymbol]
														?.wallet ?? 0
												)
													.div(
														10 **
															tokens[tokenSymbol]
																.decimals
													)
													.toFixed(
														tickToPrecision(
															tokens[tokenSymbol].minimum_increment
														)
													)}{" "}
												{tokenSymbol}
											</Text>
									
								</Td>
								<Td borderColor={"whiteAlpha.200"} isNumeric>
									{
										<Flex gap={2} justify='end'>
											<DepositModal
												_tokenSymbol={tokenSymbol}
											/>
											<WithdrawModal
												_tokenSymbol={tokenSymbol}
											/>
										</Flex>
									}
								</Td>
							</Tr>
						);
					})}
				</Tbody>
			</Table>
		</TableContainer>
	);
}
