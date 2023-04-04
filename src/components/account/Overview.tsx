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
	Heading,
	Tooltip,
} from "@chakra-ui/react";
import { ASSET_NAMES, FAUCET } from "@/constants";
import { transactions } from "near-api-js";
import Deposit from "./Deposit";
import Big from "big.js";
import { dollarFormatter, tickToPrecision } from "../../utils";
import DepositModal from "@/components/spot/balances/DepositModal";
import WithdrawModal from "../spot/balances/WithdrawModal";
import TestTokens from "./TestTokens";

const TOKEN_COLORS: any = {
	USDC: "blue.400",
	ETH: "purple",
	BTC: "orange",
	LINK: "teal",
	NEAR: "whiteAlpha.700",
	SWEAT: "pink",
	REF: "yellow",
	WOO: "whiteAlpha.400",
};

export default function Overview() {
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
		<Flex h={'100%'} px={4} justify="end" align={"center"}>
			<Box>
				<Heading size={"sm"} color="whiteAlpha.700">
					Portfolio
				</Heading>
				
			</Box>
		</Flex>
	);
}
