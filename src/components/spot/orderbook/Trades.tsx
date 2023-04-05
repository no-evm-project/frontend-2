import { AppDataContext } from "@/contexts/AppData";
import { DataContext } from "@/contexts/DataProvider";
import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import { Box, Flex, Progress, SlideFade, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";

function Order({ trade, pair }: any) {

	return (
		<Flex justify="space-between"
			color={trade.side == 'BUY' ? 'buy.400' : 'sell.400'}
			py={'2.5px'}
			px={4}
			mb={0}
			// _hover={{ bgColor: trade.side == 'BUY' ? 'rgba(24, 176, 95, 10%)' : 'rgba(200, 50, 50, 10%)' }}
			// bgGradient={'linear(to-r,' + (trade.side == 'BUY' ? 'rgba(24, 176, 95, 10%), rgba(24, 176, 95, 10%))' : 'rgba(200, 50, 50, 20%), rgba(200, 50, 50, 10%))')}
			bgRepeat='no-repeat'
			fontSize='sm'
			cursor={'pointer'}
		>
			<Text w={'30%'}>{trade.executed_price.toFixed((pair?.quote_tick ?? 0.001).toString().length - 2)}</Text>
			<Text w={'36%'} textAlign='right'>{(trade.executed_price * trade.executed_quantity).toFixed((pair?.quote_tick ?? 0.001).toString().length - 2)}</Text>

			<Text w={'33%'} textAlign='right'>{trade.executed_quantity.toFixed((pair?.base_tick >= 1 ? '..' : pair?.base_tick ?? 0.001).toString().length - 2)}</Text>
		</Flex>
	);
}

export default function Trades({ pair }: any) {
	const { orderbook, bbos, trades } = useContext(DataContext);

	const {accountId} = useWalletSelector();
	
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
				<SlideFade in={true} offsetY='-20px'>
			<Box>
				<Flex justify="space-between" px={4} py={2}>
					<Text
					w={'30%'}
						fontSize={"xs"}
						color="whiteAlpha.700"
						fontWeight={"bold"}
					>
						Price
					</Text>
					<Text
					w={'36%'}
						fontSize={"xs"}
						color="whiteAlpha.700"
						fontWeight={"bold"}
						textAlign='right'
					>
						{pair?.symbol.split('_')[2]}
					</Text>
					<Text
					w={'33%'}
						fontSize={"xs"}
						color="whiteAlpha.700"
						fontWeight={"bold"}
						textAlign='right'
					>
						{pair?.symbol.split('_')[1]}
					</Text>
				</Flex>

				{trades[pair.symbol] && bbos[pair.symbol] ? (
					<>
						{trades[pair.symbol].slice(0, 15).map((trade: any) => (
							<>
                                <Order trade={trade} pair={pair} />
                            </>
						))}
					</>
				) : (
					<>
						<Progress isIndeterminate />
					</>
				)}
			</Box>
			</SlideFade>
		)}
		</>
	);
}
