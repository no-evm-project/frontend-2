import { DataContext } from "@/contexts/DataProvider";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import { useContext } from "react";

import { Heading } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import OpenOrders from "./OpenOrders";
import OrderHistory from "./OrderHistory";

const tabStyle = {
	rounded: 0,
	bg: "background.500",
	_selected: { bg: "background.400", color: "white" },
	fontSize: 'sm',
	py: 2.5
};

export default function Orders({ pair }: any) {
	return (
		<Box>
			<Box>
				<Tabs variant={"soft-rounded"} size={"md"}>
					<TabList>
						<Tab {...tabStyle}>Open Orders</Tab>
						<Tab {...tabStyle}>Order History</Tab>
					</TabList>
					<TabPanels>
						<TabPanel py={2} px={0} m={0}>
							<OpenOrders pair={pair} />
						</TabPanel>
						<TabPanel py={2} px={0} m={0}>
							<OrderHistory />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Box>
	);
}
