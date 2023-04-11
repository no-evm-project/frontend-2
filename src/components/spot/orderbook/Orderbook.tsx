import { AppDataContext } from "@/contexts/AppData";
import { DataContext } from "@/contexts/DataProvider";
import { tickToPrecision } from "@/utils";
import { Box, Divider, Flex, Progress, Text, Tooltip } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import ConnectButton from '../../ConnectButton';

function Order({
	order,
	total,
	orderType,
	pair,
	hoveredOrder,
	orderIndex,
}: any) {
	const { setExchangeRate } = useContext(AppDataContext);
	const { orders } = useContext(DataContext);

	const exists = orders.find((o: any) => o.price == order[0] && o.status !== "FILLED" && o.status !== "CANCELLED");

	return (
		<Box>
			{orderType == "ASK" && hoveredOrder == orderIndex && (
				<Divider variant={"dashed"} borderColor="whiteAlpha.400" />
			)}
			<Flex
				justify="space-between"
				color={orderType == "BID" ? "buy.400" : "sell.400"}
				py={"2.5px"}
				pl={3}
				pr={4}
				mb={0}
				bgColor={
					(orderType == "BID" && hoveredOrder >= orderIndex) ||
					(orderType == "ASK" && hoveredOrder <= orderIndex)
						? orderType == "BID"
							? "rgba(108, 62, 199, 8%)"
							: "rgba(108, 62, 199, 8%)"
						: "transparent"
				}
				bgGradient={
					"linear(to-r," +
					(orderType == "BID"
						? "rgba(24, 176, 95, 10%), rgba(24, 176, 95, 10%))"
						: "rgba(200, 50, 50, 10%), rgba(200, 50, 50, 10%))")
				}
				bgRepeat="no-repeat"
				bgSize={((120 * order[1]) / total).toString() + "%"}
				fontSize="sm"
				cursor={"pointer"}
				onClick={() =>
					setExchangeRate(
						order[0].toFixed(tickToPrecision(pair?.quote_tick))
					)
				}
				borderLeft='2px'
				borderLeftColor={exists ? orderType == "BID" ? 'buy.400' : 'sell.400' : 'transparent'}
			>
				<Text  w={"30%"}>
					{order[0].toFixed(tickToPrecision(pair?.quote_tick))}
				</Text>
				<Text w={"36%"} textAlign="right">
					{(order[0] * order[1]).toFixed(
						tickToPrecision(pair?.quote_tick)
					)}
				</Text>

				<Text w={"33%"} textAlign="right">
					{order[1].toFixed(tickToPrecision(pair?.base_tick))}
				</Text>
			</Flex>
			{orderType == "BID" && hoveredOrder == orderIndex && (
				<Divider variant={"dashed"} borderColor="whiteAlpha.400" />
			)}
		</Box>
	);
}

export default function Orderbook({ pair }: any) {
	const { orderbook, bbos, trades } = useContext(DataContext);

	const { accountId } = useWalletSelector();

	const [maxBid, setMaxBid] = useState(0);
	const [maxAsk, setMaxAsk] = useState(0);

	const [hoveredBuyOrder, setHoveredBuyOrder] = useState<any>(-1);
	const [hoveredSellOrder, setHoveredSellOrder] = useState<any>(100);

	useEffect(() => {
		if (orderbook[pair.symbol]) {
			// calculate max bid
			setMaxBid(
				orderbook[pair.symbol].bids.reduce((acc: any, cur: any) => {
					return Number(acc) > Number(cur[1])
						? Number(acc)
						: Number(cur[1]);
				}, 0)
			);
			// calculate total sell
			setMaxAsk(
				orderbook[pair.symbol].asks.reduce((acc: any, cur: any) => {
					return Number(acc) > Number(cur[1])
						? Number(acc)
						: Number(cur[1]);
				}, 0)
			);
		}
	});

	return (
		<>
			<Box>
				<Flex justify="space-between" px={4} py={2} >
					<Text
						w={"30%"}
						fontSize={"xs"}
						color="whiteAlpha.700"
						fontWeight={"bold"}
					>
						Price
					</Text>
					<Text
						w={"36%"}
						fontSize={"xs"}
						color="whiteAlpha.700"
						fontWeight={"bold"}
						textAlign="right"
					>
						{pair?.symbol.split("_")[2]}
					</Text>
					<Text
						w={"33%"}
						fontSize={"xs"}
						color="whiteAlpha.700"
						fontWeight={"bold"}
						textAlign="right"
					>
						{pair?.symbol.split("_")[1]}
					</Text>
				</Flex>

				{orderbook[pair.symbol] && bbos[pair.symbol] ? (
					<>
						{[...orderbook[pair.symbol].asks]
							.reverse()
							.slice(-15)
							.map((ask: any, index: number) => (
								// <Order order={ask} key={ask[0]} orderType='ASK' total={maxAsk} pair={pair} />
								<Tooltip
									bg={"background.300"}
									hasArrow
									placement="right"
									p={0}
									m={0}
									key={index}
									label={
										<HoveredState
											orderIndex={index}
											pair={pair}
											side="ASKS"
										/>
									}
									// animation="none"
								>
									<Box
										onMouseEnter={() =>
											setHoveredSellOrder(index)
										}
										onMouseLeave={() =>
											setHoveredSellOrder(100)
										}
									>
										<Order
											order={ask}
											key={index}
											orderIndex={index}
											hoveredOrder={
												hoveredSellOrder
											}
											orderType="ASK"
											total={maxAsk}
											pair={pair}
										/>
									</Box>
								</Tooltip>
							))}
						<Flex py={4} px={4} justify="space-between" bg={'background.500'}>
							{/* <Flex
								color={
									trades[pair.symbol]?.[0]?.side ==
									"BUY"
										? "buy.400"
										: "sell.400"
								}
								align="center"
							>
								<Text fontSize={"xl"} fontWeight="bold">
									{(trades[pair.symbol]?.[0]?.executed_price ?? 0
									).toFixed(
										tickToPrecision(
											pair?.quote_tick
										)
									)}
								</Text>
								{trades[pair.symbol]?.[0]?.side !==
								"BUY" ? (
									<AiFillCaretDown />
								) : (
									<AiFillCaretUp />
								)}
							</Flex> */}

							<Text
								fontSize={"xs"}
								mt={1}
								color="whiteAlpha.800"
							>
								Spread{" "}
								{(
									(100 *
										(bbos[pair.symbol].ask -
											bbos[pair.symbol].bid)) /
									bbos[pair.symbol].ask
								).toFixed(2)}{" "}
								%
							</Text>
						</Flex>
						{orderbook[pair.symbol].bids
							.slice(0, 15)
							.map((bid: any, index: number) => (
								<Tooltip
									bg={"background.300"}
									hasArrow
									placement="right"
									p={0}
									m={0}
									key={index}
									label={
										<HoveredState
											orderIndex={index}
											pair={pair}
											side="BIDS"
										/>
									}
									animation="none"
								>
									<Box
										onMouseEnter={() =>
											setHoveredBuyOrder(index)
										}
										onMouseLeave={() =>
											setHoveredBuyOrder(-1)
										}
									>
										<Order
											order={bid}
											key={index}
											orderIndex={index}
											hoveredOrder={
												hoveredBuyOrder
											}
											orderType="BID"
											total={maxBid}
											pair={pair}
										/>
									</Box>
								</Tooltip>
							))}
					</>
				) : (
					<>
						<Progress size="xs" bg={'transparent'} colorScheme='background' isIndeterminate />
						<Text fontSize={'sm'} mt={2} textAlign='center' color={'whiteAlpha.600'}>Loading</Text>
					</>
				)}
			</Box>
		</>
	);
}

const HoveredState = ({ pair, orderIndex, side }: any) => {
	const { orderbook } = useContext(DataContext);

	const orders =
		side == "BIDS"
			? orderbook[pair.symbol][side.toLowerCase()].slice(
					0,
					orderIndex + 1
			  )
			: orderbook[pair.symbol][side.toLowerCase()]
					.slice(
						0,
						orderbook[pair.symbol][side.toLowerCase()].length -
							orderIndex
					)
					.reverse();

	const averagePrice =
		orders.reduce((acc: any, cur: any) => {
			return acc + cur[0] * cur[1];
		}, 0) /
		orders.reduce((acc: any, cur: any) => {
			return acc + cur[1];
		}, 0);

	const totalBase = orders.reduce((acc: any, cur: any) => {
		return acc + cur[1];
	}, 0);

	const totalQuote = orders.reduce((acc: any, cur: any) => {
		return acc + cur[0] * cur[1];
	}, 0);

	return (
		<>
			<Box
				p={2}
				px={3}
				// border="2px"
				// bg={"background.400"}
				// borderColor={"whiteAlpha.300"}
				color="white"
			>
				<Text fontSize={"xs"} color="whiteAlpha.700">
					Average Price
				</Text>
				<Text>
					{averagePrice.toFixed(tickToPrecision(pair.quote_tick))}{" "}
					{pair.symbol.split("_")[1]}/{pair.symbol.split("_")[2]}
				</Text>
				<Divider my={2} borderColor={"whiteAlpha.200"} />
				<Text fontSize={"xs"} color="whiteAlpha.700">
					Size
				</Text>
				<Text>
					{totalQuote.toFixed(tickToPrecision(pair.base_tick))}{" "}
					{pair.symbol.split("_")[2]}
				</Text>
				<Text>
					{totalBase.toFixed(tickToPrecision(pair.base_tick))}{" "}
					{pair.symbol.split("_")[1]}
				</Text>
			</Box>
		</>
	);
};
