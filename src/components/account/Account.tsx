import React from "react";
import {
	Avatar,
	Box,
	Button,
	Divider,
	Flex,
	Progress,
	Text,
} from "@chakra-ui/react";

import { useContext } from "react";
import { DataContext, DataProvider } from "@/contexts/DataProvider";
import BN from "bn.js";
import Volume from "@/components/account/Volume";

export default function Account() {
	const { tokens, account } = useContext(DataContext);

	if (!account) return <></>;

	return (
		<>
			<Flex px={4} pr={8} align={'center'}>
				<Avatar
					bgGradient={"linear(to-r, #E11860, #CB1DC3)"}
					icon={
						<Text fontWeight={"bold"}>
							{account?.accountId?.slice(0, 2)}
						</Text>
					}
					size={"lg"}
				></Avatar>
				<Box>
					<Text ml={4} fontSize="xl" fontWeight={"bold"}>
						{account?.accountId}
					</Text>
					<Text ml={4} fontSize="sm" color={"gray.400"}>
						{(
							Number(account?.balance.toString()) /
							10 ** (tokens["NEAR"]?.decimals ?? 1)
						).toFixed(2)}{" "}
						NEAR
					</Text>
				</Box>
			</Flex>
		</>
	);
}
