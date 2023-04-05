import React from "react";
import {
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	SlideFade,
} from "@chakra-ui/react";
import Buy from "./Buy";
import { RiArrowDropDownLine } from "react-icons/ri";
import Sell from "./Sell";

const OrderTypeStyle = {
	bg: "background.500",
	_selected: { bg: "background.400", color: "white" },
	rounded: 0,
};

const OrderTabStyle = (color: string) => {
	return {
		rounded: 0,
		h: 10,
		bg: "background.500",
		_selected: { bg: color, color: "white" }
	}
}

export default function Trade({ pair, isOpen }: any) {
	return (
		<SlideFade offsetY={"20px"} in={isOpen}>
			<Tabs isFitted size={"md"} variant="soft-rounded">
				<TabList mt={4} mb={2} px={4}>
					<Tab {...OrderTabStyle("buy.700")}>
						Buy
					</Tab>
					<Tab {...OrderTabStyle("red.400")}>
						Sell
					</Tab>
				</TabList>
				<TabPanels>
					<TabPanel px={0} py={2} m={0}>
						<Tabs isFitted size={"sm"} variant="soft-rounded">
							<TabList px={4}>
								<Tab {...OrderTypeStyle}>Limit</Tab>
								<Tab {...OrderTypeStyle}>Market</Tab>
								<Tab
									pl="6"
									{...OrderTypeStyle}
									isDisabled={true}
									opacity='1'
								>
									Stop <RiArrowDropDownLine size={"25px"} />
								</Tab>
							</TabList>
							<TabPanels>
								<TabPanel m={0} mt={1}>
									<Buy pair={pair} market={false} />
								</TabPanel>
								<TabPanel m={0} mt={1}>
									<Buy pair={pair} market={true} />
								</TabPanel>
							</TabPanels>
						</Tabs>
					</TabPanel>
					<TabPanel px={0} py={2} m={0}>
						<Tabs isFitted size={"sm"} variant="soft-rounded">
							<TabList px={4}>
								<Tab {...OrderTypeStyle}>Limit</Tab>
								<Tab {...OrderTypeStyle}>Market</Tab>
								<Tab
									pl="6"
									{...OrderTypeStyle}
									isDisabled={true}
									opacity='1'
								>
									Stop <RiArrowDropDownLine size={"25px"} />
								</Tab>
							</TabList>
							<TabPanels>
								<TabPanel m={0} mt={1}>
									<Sell pair={pair} market={false} />
								</TabPanel>
								<TabPanel m={0} mt={1}>
									<Sell pair={pair} market={true} />
								</TabPanel>
							</TabPanels>
						</Tabs>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</SlideFade>
	);
}
