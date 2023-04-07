import Graph from "@/components/graph";
import Orderbook from "@/components/spot/orderbook";
import Orders from "@/components/spot/orders";
import Title from "@/components/spot/title";
import Trade from "@/components/spot/trade";
import { DataContext } from "@/contexts/DataProvider";
import { Box, Divider, Flex, useDisclosure } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { useEffect } from "react";
import { tickToPrecision } from "../../utils";
import Balances from "../../components/spot/balances";
import Deposit from "@/components/spot/balances/Deposit";
import Withdraw from "@/components/spot/balances/Withdraw";

export default function Pair() {
	const router = useRouter();
	const { pair: pairId } = router.query;
	const { pairs, trades } = useContext(DataContext);
	const [pair, setPair] = React.useState<any>(null);

	const {
		isOpen: isDepositOpen,
		onOpen: _onDepositOpen,
		onClose: onDepositClose,
	} = useDisclosure();
	const {
		isOpen: isWithdrawOpen,
		onOpen: _onWithdrawOpen,
		onClose: onWithdrawClose,
	} = useDisclosure();

	const onWithdrawOpen = () => {
		onDepositClose();
		_onWithdrawOpen();
	};

	const onDepositOpen = () => {
		onWithdrawClose();
		_onDepositOpen();
	};

	useEffect(() => {
		if (pairs.length > 0) {
			setPair(pairs.find((pair: any) => pair.symbol == "SPOT_" + pairId));
		}
	}, [pairs, pairId]);

	if (pair == null) return <></>;

	return (
		<>
			<Head>
				<title>
					{" "}
					{trades[pair?.symbol]?.[0]?.executed_price}{" "}
					{pair?.symbol.split("_")[1]}/{pair?.symbol.split("_")[2]} |
					ZEXE
				</title>
				<link rel="icon" type="image/x-icon" href="/x.png"></link>
			</Head>
			<Box>
				<Title pair={pair} />
			</Box>
			<Box>
				<Divider />
			</Box>
			<Flex flexDir={{xs: 'column', sm: 'column', md: 'row'}} justify={"stretch"}>
				<Flex order={{ xs: 3, sm: 3, md: 1}} flexDir={"column"} minW="400px">
					<Box bg="background.600" px={1}>
						{isDepositOpen ? (
							<Deposit
								pair={pair}
								onClose={onDepositClose}
								isOpen={isDepositOpen}
							/>
						) : isWithdrawOpen ? (
							<Withdraw
								pair={pair}
								onClose={onWithdrawClose}
								isOpen={isWithdrawOpen}
							/>
						) : (
							<Trade
								pair={pair}
								isOpen={!isDepositOpen && !isWithdrawOpen}
							/>
						)}
					</Box>
					<Box>
						<Divider />
					</Box>
					<Box bg="background.600" flexGrow={1} px={1}>
						<Balances
							pair={pair}
							isDepositOpen={isDepositOpen}
							onDepositOpen={onDepositOpen}
							onDepositClose={onDepositClose}
							isWithdrawOpen={isWithdrawOpen}
							onWithdrawOpen={onWithdrawOpen}
							onWithdrawClose={onWithdrawClose}
						/>
					</Box>
				</Flex>

				<Box order={{ xs: 2, sm: 2, md: 2}}>
					<ResponsiveDivider />
				</Box>

				<Box order={{ xs: 5, sm: 5, md: 3}} minW="300px" bg="background.600">
					<Orderbook pair={pair} />
				</Box>

				<Box order={{ xs: 4, sm: 4, md: 4}}>
					<ResponsiveDivider />
				</Box>

				<Flex order={{xs: 1, sm: 1, md: 5}} flexDir={"column"} flexGrow={1}>
					<Box mt={"0.5px"}>
						<Graph pair={pair} />
					</Box>
					<Box display={{xs: 'none', sm: 'none', md: 'block'}} >
						<Divider />
					</Box>
					<Box flexGrow={1} bg={"background.600"} display={{xs: 'none', sm: 'none', md: 'block'}} >
						<Orders pair={pair} />
					</Box>
				</Flex>

				
			</Flex>
		</>
	);
}

function ResponsiveDivider() {
	return (
		<>
			<Box display={{ sm: "none", md: "block" }}>
				<Divider orientation={"vertical"} h='100%' />
			</Box>
			<Box display={{ sm: "block", md: "none" }}>
				<Divider orientation={"horizontal"} />
			</Box>
		</>
	);
}
