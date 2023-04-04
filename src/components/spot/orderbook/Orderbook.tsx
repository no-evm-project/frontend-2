import { AppDataContext } from "@/contexts/AppData";
import { DataContext } from "@/contexts/DataProvider";
import { tickToPrecision } from "@/utils";
import { Box, Divider, Flex, Text, Tooltip } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";

function Order({
	order,
	total,
	orderType,
	pair,
	hoveredOrder,
	orderIndex,
}: any) {
	const { setExchangeRate } = useContext(AppDataContext);

	return (
		<Box>
			{orderType == "ASK" && hoveredOrder == orderIndex && (
				<Divider variant={"dashed"} borderColor="whiteAlpha.400" />
			)}
			<Flex
				justify="space-between"
				color={orderType == "BID" ? "green2" : "red2"}
				py={"2.5px"}
				px={4}
				mb={0}
				bgColor={
					(orderType == "BID" && hoveredOrder >= orderIndex) ||
					(orderType == "ASK" && hoveredOrder <= orderIndex)
						? orderType == "BID"
							? "rgba(24, 176, 95, 8%)"
							: "rgba(200, 50, 50, 8%)"
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
			>
				<Text w={"30%"}>
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
			{!accountId ? (
				<>
					<Box>
						<Text textAlign={"center"} mt={5}>
							Connect Your Wallet
						</Text>
					</Box>
				</>
			) : (
				<>
					<Box>
						<Flex justify="space-between" px={4} py={2}>
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
											bg={"background1"}
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
											animation="none"
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
								<Flex py={4} px={4} justify="space-between">
									<Flex
										color={
											trades[pair.symbol][0]?.side ==
											"BUY"
												? "green2"
												: "red2"
										}
										align="center"
									>
										<Text fontSize={"xl"} fontWeight="bold">
											{(trades[pair.symbol]
												? trades[pair.symbol][0]
														.executed_price
												: 0
											).toFixed(
												tickToPrecision(
													pair?.quote_tick
												)
											)}
										</Text>
										{trades[pair.symbol][0]?.side !==
										"BUY" ? (
											<AiFillCaretDown />
										) : (
											<AiFillCaretUp />
										)}
									</Flex>

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
											bg={"background1"}
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
								<Text>Loading</Text>
							</>
						)}
					</Box>
				</>
			)}
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
				bg={"whiteAlpha.200"}
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
					{pair.symbol.split("_")[1]}
				</Text>
				<Text>
					{totalBase.toFixed(tickToPrecision(pair.base_tick))}{" "}
					{pair.symbol.split("_")[2]}
				</Text>
			</Box>
		</>
	);
};