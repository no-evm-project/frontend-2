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
	bg: "background.500",
	_selected: { bg: "background.300", color: "white" },
}

export default function Index({ pair }: any) {

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
