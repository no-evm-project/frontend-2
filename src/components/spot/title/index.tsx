import { DataContext } from "@/contexts/DataProvider";
import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import { Flex, Text, Box } from "@chakra-ui/react";
import React, { useContext } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import TokenSelector from "./TokenSelector";
import { tickToPrecision } from '../../../utils';

export default function Title({ pair }: any) {
	const { bbos, trades, tickers } = useContext(DataContext);
	const { accountId } = useWalletSelector();

	if (!trades[pair.symbol]) return <></>;
	// if(!trades[pair.symbol][0]) return <></>
	return (
		<Flex w={"100%"} h={20} align="center" gap={1}>
			<Flex justify={"center"} flexDir="column" minW={"400px"} h={"94%"}>
				<TokenSelector pair={pair} />
			</Flex>

			<Flex
				color={
					trades[pair.symbol][0]?.side == "BUY" ? "green2" : "red2"
				}
				align="center"
				minW={"300px"}
				p={4}
				bg="background2"
				h={"94%"}
				justify='space-between'
			>
				<Flex gap={1} align='center'>
				<Text fontSize={"2xl"} fontWeight="bold">
					{(trades[pair.symbol]
						? trades[pair.symbol][0]?.executed_price
						: 0
					).toFixed(
						(pair?.quote_tick ?? 0.001).toString().length - 2
					)}
				</Text>
				{trades[pair.symbol][0]?.side !== "BUY" ? (
					<AiFillCaretDown size={"20px"} />
				) : (
					<AiFillCaretUp size={"20px"} />
				)}
				</Flex>

				<Box textAlign={'right'}>
					<Text color={'whiteAlpha.700'} fontSize='xs'>Index Price</Text>
					<Text mt={-1} color={'whiteAlpha.800'} fontSize='sm'>-</Text>
				</Box>
			</Flex>

			{tickers[pair.symbol] && trades[pair.symbol] ? (
				<Flex
					flexGrow={1}
					gap={16}
					px={5}
					bg="background2"
					h={"94%"}
					align="center"
				>
					<Box color={trades[pair.symbol][0]?.executed_price >= tickers[pair.symbol].open ? 'green2' : 'red2'}>
					<Param
						title="24H Change"
						subtitle={
							(tickers[pair.symbol]
								? (trades[pair.symbol][0]?.executed_price - tickers[pair.symbol].open).toFixed((pair?.quote_tick ?? 0.001).toString().length - 2) +' ('+ (100*(trades[pair.symbol][0]?.executed_price - tickers[pair.symbol].open) / trades[pair.symbol][0]?.executed_price).toFixed(2) + '%)'
								: '-')
						}
					/>
					</Box>
					<Param
						title="24H Volume"
						subtitle={
							(tickers[pair.symbol]
								? (tickers[pair.symbol].volume).toFixed(tickToPrecision(pair?.quote_tick))
								: '-')
						}
					/>

					<Param
						title="24H Open"
						subtitle={(tickers[pair.symbol]
							? tickers[pair.symbol].open
							: 0
						).toFixed(
							(pair?.quote_tick ?? 0.001).toString().length - 2
						)}
					/>

					<Param
						title="24H Close"
						subtitle={(tickers[pair.symbol]
							? tickers[pair.symbol].close
							: 0
						).toFixed(
							(pair?.quote_tick ?? 0.001).toString().length - 2
						)}
					/>

					<Param
						title="24H High"
						subtitle={(tickers[pair.symbol]
							? tickers[pair.symbol].high
							: 0
						).toFixed(
							(pair?.quote_tick ?? 0.001).toString().length - 2
						)}
					/>

					<Param
						title="24H Low"
						subtitle={(tickers[pair.symbol]
							? tickers[pair.symbol].low
							: 0
						).toFixed(
							(pair?.quote_tick ?? 0.001).toString().length - 2
						)}
					/>
				</Flex>
			) : !accountId ? (<Flex
				flexGrow={1}
				gap={16}
				px={5}
				bg="background2"
				h={"94%"}
				align="center"
			></Flex>) : (
				<>Loading</>
			)}
		</Flex>
	);
}

const Param = ({ title, subtitle }: any) => {
	return (
		<Box>
			<Text fontSize={"xs"} color="gray.500">
				{title}
			</Text>
			<Text fontSize={"sm"}>{subtitle}</Text>
		</Box>
	);
};
