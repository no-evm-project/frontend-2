import Graph from "@/components/graph";
import Orderbook from "@/components/spot/orderbook";
import Orders from "@/components/spot/orders";
import Title from "@/components/spot/title";
import Trade from "@/components/spot/trade";
import { DataContext } from "@/contexts/DataProvider";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
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
					{trades[pair?.symbol]?.[0]?.executed_price.toFixed(
						tickToPrecision(pair?.quote_tick)
					)}{" "}
					{pair?.symbol.split("_")[1]}/{pair?.symbol.split("_")[2]} |
					ZEXE
				</title>
				<link rel="icon" type="image/x-icon" href="/x.png"></link>
			</Head>
			<Box>
				<Title pair={pair} />
			</Box>
			<Flex>
				<Flex flexDir={"column"} gap={1} minW="400px">
					<Box bg="background2">
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
					<Box bg="background2" flexGrow={1}>
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
				<Box minW="300px" bg="background2" mx={1}>
					<Orderbook pair={pair} />
				</Box>

				<Flex flexDir={'column'} flexGrow={1}>
					<Box mb={1} mt={"0.5px"} >
						<Graph pair={pair} />
					</Box>
					<Box flexGrow={1} bg={"background2"}>
						<Orders pair={pair} />
					</Box>
				</Flex>
			</Flex>
		</>
	);
}
