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
	bg: "whiteAlpha.50",
	_selected: { bg: "whiteAlpha.300", color: "white" },
	rounded: 0,
};

export default function Trade({ pair, isOpen }: any) {
	return (
		<SlideFade offsetY={"20px"} in={isOpen}>
			<Tabs isFitted size={"md"} variant="soft-rounded">
				<TabList mt={4} mb={2} px={4}>
					<Tab
						rounded={0}
						h={10}
						bg="whiteAlpha.100"
						_selected={{ bg: "green2", color: "white" }}
					>
						Buy
					</Tab>
					<Tab
						rounded={0}
						h={10}
						bg="whiteAlpha.100"
						_selected={{ bg: "red2", color: "white" }}
					>
						Sell
					</Tab>
				</TabList>
				<TabPanels>
					<TabPanel px={0} m={0}>
						<Tabs isFitted size={"sm"} variant="soft-rounded">
							<TabList px={4}>
								<Tab {...OrderTypeStyle}>Limit</Tab>
								<Tab {...OrderTypeStyle}>Market</Tab>
								<Tab
									pl="6"
									{...OrderTypeStyle}
									isDisabled={true}
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
					<TabPanel px={0} m={0}>
						<Tabs isFitted size={"sm"} variant="soft-rounded">
							<TabList px={4}>
								<Tab {...OrderTypeStyle}>Limit</Tab>
								<Tab {...OrderTypeStyle}>Market</Tab>
								<Tab
									pl="6"
									{...OrderTypeStyle}
									isDisabled={true}
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
