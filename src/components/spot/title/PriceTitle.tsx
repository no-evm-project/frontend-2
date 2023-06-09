import { DataContext } from "@/contexts/DataProvider";
import { Flex, Text, Box, Divider } from "@chakra-ui/react";
import Big from "big.js";
import React, { useContext } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

export default function PriceTitle({ pair }: any) {
	const { bbos, trades, tickers } = useContext(DataContext);
	return (
        <Flex
            color={
                trades[pair?.symbol]?.[0]?.side == "BUY"
                    ? "buy.400"
                    : "sell.400"
            }
            align="center"
            p={4}
            bg="background.600"
            h={"100%"}
            w='100%'
            justify="space-between"
        >
            <Flex gap={1} align="center">
                <Text fontSize={"2xl"} fontWeight="bold">
                    {(trades[pair?.symbol]?.[0]?.executed_price ?? 0).toFixed(
                        (pair?.quote_tick ?? 0.001).toString().length - 2
                    )}
                </Text>
                {trades[pair?.symbol]?.[0]?.side !== "BUY" ? (
                    <AiFillCaretDown size={"20px"} />
                ) : (
                    <AiFillCaretUp size={"20px"} />
                )}
            </Flex>

            <Box textAlign={"right"}>
                {/* <Text color={"whiteAlpha.700"} fontSize="xs">
                    Index Price
                </Text>
                <Text mt={-1} color={"whiteAlpha.800"} fontSize="sm">
                    -
                </Text> */}
                <Box>
                    <Text fontSize={"xs"} color="gray.500">
                        24H Change
                    </Text>
                    <Text fontSize={"sm"}>{(trades[pair?.symbol] && tickers[pair?.symbol])
                            ? (
                                    Big(trades[pair?.symbol]?.[0]?.executed_price ?? 0).sub(
                                        (tickers[pair?.symbol]?.open ?? 0)
                                        ).toNumber()
                                ) +
                                " (" +
                                (
                                    (100 *
                                        (trades[pair?.symbol]?.[0]?.executed_price -
                                            (tickers[pair?.symbol]?.open ?? 0))) /
                                            (tickers[pair?.symbol]?.open ?? 1)
                                ).toFixed(2) +
                                "%)"
                            : "-"}</Text>
                </Box>
            </Box>
        </Flex>
	);
}