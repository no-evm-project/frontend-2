import { Flex, Text, Box, Divider } from "@chakra-ui/react";
import React, { useContext } from "react";
import TokenSelector from "./TokenSelector";
import { tickToPrecision } from "../../../utils";
import PriceTitle from './PriceTitle';
import StatsTitle from "./StatsTitle";

export default function Title({ pair }: any) {

	return (
		<Flex flexDir={{xs: 'column', sm: 'column', md: 'row'}} w={"100%"}  align="center">
			<Box h={20} minW={{xs: '100%', sm: '100%', md: '400px'}}>
				<TokenSelector pair={pair} />
			</Box>
			
			<ResponsiveDivider />
			
			<Box h={20} minW={{xs: '100%', sm: '100%', md: '300px'}}>
				<PriceTitle pair={pair} />
			</Box>

			<Box display={{ xs: "none", sm: "block", md: "block" }}>
			<ResponsiveDivider />
			</Box>

			<Box h={20} display={{ xs: "none", sm: "block", md: "block" }} flexGrow={1} w='100%'>
				<StatsTitle pair={pair} />
			</Box>
		</Flex>
	);
}

function ResponsiveDivider() {
	return (
		<>
			<Box display={{ xs: "none", sm: "none", md: "block" }}>
				<Divider orientation={"vertical"} h={"20"} />
			</Box>
			<Box display={{ xs: "block", sm: "block", md: "none" }}>
				<Divider orientation={"horizontal"} w="100vw" />
			</Box>
		</>
	);
}
