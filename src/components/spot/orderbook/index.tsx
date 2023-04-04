import { AppDataContext } from "@/contexts/AppData";
import { DataContext } from "@/contexts/DataProvider";
import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Orderbook from "./Orderbook";
import Trades from "./Trades";

const TabStyle = {
	rounded: 0,
	bg: "whiteAlpha.50",
	_selected: { bg: "whiteAlpha.200", color: "white" },
}

export default function Index({ pair }: any) {
	const { orderbook, bbos, trades } = useContext(DataContext);

	return (
		<>
			<Tabs isFitted variant="soft-rounded" colorScheme="green">
				<TabList>
					<Tab {...TabStyle}>
						Book
					</Tab>
					<Tab {...TabStyle}>
						Trades
					</Tab>
				</TabList>
				<TabPanels>
					<TabPanel p={0} m={0}>
						<Orderbook pair={pair} />
					</TabPanel>
					<TabPanel p={0} m={0}>
						<Trades pair={pair} />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</>
	);
}
