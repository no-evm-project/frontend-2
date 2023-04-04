import { DataContext } from "@/contexts/DataProvider";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import { useContext } from "react";

import { Heading } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import OpenOrders from "./OpenOrders";
import OrderHistory from "./OrderHistory";

export default function Orders({ pair }: any) {
	const { orders } = useContext(DataContext);
	return (
		<Box>
			{/* {"symbol":"SPOT_ETH_USDC","status":"NEW","side":"BUY","order_id":10203011,"user_id":89463,"price":900,"type":"LIMIT","quantity":0.1,"amount":null,"visible":0.1,"executed":0,"total_fee":0,"fee_asset":"ETH","client_order_id":null,"average_executed_price":null,"created_time":1679681235626,"updated_time":1679681235654,"broker_id":"zexe_dex","broker_name":"ZEXE DEX"}, */}
			<Box >
				<Tabs variant={'soft-rounded'} size={'md'}>
					<TabList>
						<Tab rounded={0}
					bg='background2'
					_selected={{ bg: "whiteAlpha.100", color: "white" }}>Open Orders</Tab>
						<Tab rounded={0}
					bg='background2'
					_selected={{ bg: "whiteAlpha.100", color: "white" }}>Order History</Tab>
					</TabList>
					<TabPanels>
						<TabPanel py={2} px={0} m={0}>
							<OpenOrders pair={pair} />
						</TabPanel>
						<TabPanel py={2} px={0} m={0}>
							<OrderHistory/>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Box>
	);
}
