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

const OrderTypeStyle = {};

const OrderTabStyle = (color: string) => {
	return {
		h: 10,
		fontSize: 'md',
		bg: "background.500",
		rounded: 8,
		_selected: { bg: color, color: "white"},
	}
}

export default function Trade({ pair, isOpen }: any) {
	const [dontShow, setDontShow] = React.useState<boolean | null>(null);

	const checkIt = (e: any) => {
        if (e.target.checked) {
			localStorage.removeItem("dontShowBuyModal");
			setDontShow(false);
        } else {
            localStorage.setItem("dontShowBuyModal", "true");
            setDontShow(true);
        }
    }
	return (
		<SlideFade offsetY={"20px"} in={isOpen}>
			<Tabs isFitted size={"md"} variant="soft-rounded">
				<TabList mt={4} mb={2} px={4}>
					<Tab {...OrderTabStyle("buy.700")}>
						Buy
					</Tab>
					<Tab {...OrderTabStyle("sell.400")}>
						Sell
					</Tab>
				</TabList>
				<TabPanels>
					<TabPanel px={0} py={1} m={0}>
						<Tabs size={"sm"} mx={4} colorScheme='buy'>
							<TabList>
								<Tab {...OrderTypeStyle}>Limit</Tab>
								<Tab {...OrderTypeStyle}>Market</Tab>
								<Tab
									pl="3"
									{...OrderTypeStyle}
									isDisabled={true}
									opacity='1'
								>
									Stop <RiArrowDropDownLine size={"25px"} />
								</Tab>
							</TabList>
							<TabPanels>
								<TabPanel m={0} mx={-4} mt={1}>
									<Buy dontShow={dontShow} setDontShow={setDontShow} checkIt={checkIt} pair={pair} market={false} />
								</TabPanel>
								<TabPanel m={0} mx={-4} mt={1}>
									<Buy dontShow={dontShow} setDontShow={setDontShow} checkIt={checkIt} pair={pair} market={true} />
								</TabPanel>
							</TabPanels>
						</Tabs>
					</TabPanel>
					<TabPanel px={0} py={1} m={0}>
						<Tabs size={"sm"} mx={4} colorScheme='sell'>
							<TabList>
								<Tab {...OrderTypeStyle}>Limit</Tab>
								<Tab {...OrderTypeStyle}>Market</Tab>
								<Tab
									pl="3"
									{...OrderTypeStyle}
									isDisabled={true}
									opacity='1'
								>
									Stop <RiArrowDropDownLine size={"25px"} />
								</Tab>
							</TabList>
							<TabPanels>
								<TabPanel m={0} mx={-4} mt={1}>
									<Sell dontShow={dontShow} setDontShow={setDontShow} checkIt={checkIt} pair={pair} market={false} />
								</TabPanel>
								<TabPanel m={0} mx={-4} mt={1}>
									<Sell dontShow={dontShow} setDontShow={setDontShow} checkIt={checkIt} pair={pair} market={true} />
								</TabPanel>
							</TabPanels>
						</Tabs>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</SlideFade>
	);
}
