import { DataContext } from "@/contexts/DataProvider";
import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import { Flex, Text, Box } from "@chakra-ui/react";
import React, { useContext } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import TokenSelector from "./TokenSelector";
import { tickToPrecision } from "../../../utils";

export default function Title({ pair }: any) {
	const { bbos, trades, tickers } = useContext(DataContext);
	const { accountId } = useWalletSelector();

	// if (!trades[pair.symbol]) return <></>;
	// if(!trades[pair.symbol][0]) return <></>
	return (
		<Flex w={"100%"} h={20} align="center" gap={1}>
			<Flex justify={"center"} flexDir="column" minW={"400px"} h={"94%"} my={1}>
				<TokenSelector pair={pair} />
			</Flex>

			<Flex
				color={
					trades[pair.symbol]?.[0]?.side == "BUY"
						? "buy.400"
						: "sell.400"
				}
				align="center"
				minW={"300px"}
				p={4}
				bg="background.600"
				h={"94%"}
				justify="space-between"
				my={1}
			>
				<Flex gap={1} align="center">
					<Text fontSize={"2xl"} fontWeight="bold">
						{(trades[pair.symbol]?.[0]?.executed_price ?? 0).toFixed(
							(pair?.quote_tick ?? 0.001).toString().length - 2
						)}
					</Text>
					{trades[pair.symbol]?.[0]?.side !== "BUY" ? (
						<AiFillCaretDown size={"20px"} />
					) : (
						<AiFillCaretUp size={"20px"} />
					)}
				</Flex>

				<Box textAlign={"right"}>
					<Text color={"whiteAlpha.700"} fontSize="xs">
						Index Price
					</Text>
					<Text mt={-1} color={"whiteAlpha.800"} fontSize="sm">
						-
					</Text>
				</Box>
			</Flex>

			<Flex
				flexGrow={1}
				gap={16}
				px={5}
				bg="background.600"
				h={"94%"}
				align="center"
			>
				<Box
					color={
						trades[pair.symbol]?.[0]?.executed_price >=
						(tickers[pair.symbol]?.open ?? 0)
							? "buy.400"
							: "sell.400"
					}
				>
					<Param
						title="24H Change"
						subtitle={
							trades[pair.symbol]
								? (
										trades[pair.symbol]?.[0]?.executed_price -
										(tickers[pair.symbol]?.open ?? 0)
								  ).toFixed(
										(pair?.quote_tick ?? 0.001).toString()
											.length - 2
								  ) +
								  " (" +
								  (
										(100 *
											(trades[pair.symbol]?.[0]?.executed_price -
												(tickers[pair.symbol]?.open ?? 0))) /
										trades[pair.symbol]?.[0]?.executed_price
								  ).toFixed(2) +
								  "%)"
								: "-"
						}
					/>
				</Box>
				<Param
					title="24H Volume"
					subtitle={(tickers[pair.symbol]?.volume ?? 0).toFixed(
						tickToPrecision(pair?.quote_tick)
					)}
				/>

				<Param
					title="24H Open"
					subtitle={(tickers[pair.symbol]?.open ?? 0).toFixed(
						(pair?.quote_tick ?? 0.001).toString().length - 2
					)}
				/>

				<Param
					title="24H Close"
					subtitle={(tickers[pair.symbol]?.close ?? 0).toFixed(
						(pair?.quote_tick ?? 0.001).toString().length - 2
					)}
				/>

				<Param
					title="24H High"
					subtitle={(tickers[pair.symbol]?.high ?? 0).toFixed(
						(pair?.quote_tick ?? 0.001).toString().length - 2
					)}
				/>

				<Param
					title="24H Low"
					subtitle={(tickers[pair.symbol]?.low ?? 0).toFixed(
						(pair?.quote_tick ?? 0.001).toString().length - 2
					)}
				/>
			</Flex>
		</Flex>
	);
}

const Param = ({ title, subtitle }: any) => {
	return (
		<Box>
			<Text fontSize={"xs"} color="gray.500">
				{title}
			</Text>
			<Text fontSize={"sm"}>{Number(subtitle) == 0 ? '...' : subtitle}</Text>
		</Box>
	);
};
