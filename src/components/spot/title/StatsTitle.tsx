import { DataContext } from "@/contexts/DataProvider";
import { Flex, Text, Box, Divider } from "@chakra-ui/react";
import React, { useContext } from "react";
import { tickToPrecision } from "../../../utils";

const DividerStyle = {
	mx: 5, 
	borderColor: 'background.400',
	h: 10
}

export default function StatsTitle({ pair }: any) {
	const { bbos, trades, tickers } = useContext(DataContext);
    
	return (
        <Flex
            flexGrow={1}
            px={5}
            bg="background.600"
            h={"100%"}
            align="center"
        >
            {/* <Box
                color={
                    trades[pair?.symbol]?.[0]?.executed_price >=
                    (tickers[pair?.symbol]?.open ?? 0)
                        ? "buy.400"
                        : "sell.400"
                }
            >
                <Param
                    title="24H Change"
                    subtitle={
                        trades[pair?.symbol]
                            ? (
                                    trades[pair?.symbol]?.[0]?.executed_price -
                                    (tickers[pair?.symbol]?.open ?? 0)
                                ).toFixed(
                                    (pair?.quote_tick ?? 0.001).toString()
                                        .length - 2
                                ) +
                                " (" +
                                (
                                    (100 *
                                        (trades[pair?.symbol]?.[0]?.executed_price -
                                            (tickers[pair?.symbol]?.open ?? 0))) /
                                            (tickers[pair?.symbol]?.open ?? 1)
                                ).toFixed(2) +
                                "%)"
                            : "-"
                    }
                />
            </Box> */}

            {/* <Divider orientation="vertical" {...DividerStyle} /> */}
            <Param
                title="24H Volume"
                subtitle={'$ ' + ((tickers[pair?.symbol]?.volume ?? 0) * (trades[pair?.symbol]?.[0]?.executed_price ?? 0)).toFixed(
                    tickToPrecision(pair?.quote_tick)
                )}
            />
            <Divider orientation="vertical" {...DividerStyle} />
            <Param
                title="24H Open"
                subtitle={(tickers[pair?.symbol]?.open ?? 0).toFixed(
                    (pair?.quote_tick ?? 0.001).toString().length - 2
                )}
            />
            <Divider orientation="vertical" {...DividerStyle} />
            <Param
                title="24H Close"
                subtitle={(tickers[pair?.symbol]?.close ?? 0).toFixed(
                    (pair?.quote_tick ?? 0.001).toString().length - 2
                )}
            />
            <Divider orientation="vertical" {...DividerStyle} />
            <Param
                title="24H High"
                subtitle={(tickers[pair?.symbol]?.high ?? 0).toFixed(
                    (pair?.quote_tick ?? 0.001).toString().length - 2
                )}
            />
            <Divider orientation="vertical" {...DividerStyle} />
            <Param
                title="24H Low"
                subtitle={(tickers[pair?.symbol]?.low ?? 0).toFixed(
                    (pair?.quote_tick ?? 0.001).toString().length - 2
                )}
            />
            <Divider orientation="vertical" {...DividerStyle} />
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
