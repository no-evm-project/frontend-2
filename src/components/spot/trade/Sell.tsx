import { DataContext } from "@/contexts/DataProvider";
import {
	Box,
	Button,
	Checkbox,
	CheckboxGroup,
	Divider,
	Flex,
	Input,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Stack,
	Switch,
	Text,
	Tooltip,
} from "@chakra-ui/react";
import Big from "big.js";
import React from "react";
import { useContext } from "react";
import { AppDataContext } from "@/contexts/AppData";
import { isValidNS, tickToPrecision } from "@/utils";
import NumberInputWithSlider from "@/components/inputs/NumberInputWithSlider";
import {useEffect} from 'react';
import { AxiosError, AxiosResponse } from "axios";
import { BASIS_POINTS, ORDERTYPES, ORDER_DESCRIPTIONS } from "@/constants";
import { HiOutlineReceiptPercent } from "react-icons/hi2";
import SellButton from "./SellButton";

interface ValidationResult {
	valid: boolean;
	message: string;
}
/**
 * Pair = {"symbol":"SPOT_REF_USDC","quote_min":0,"quote_max":100000,"quote_tick":0.0001,"base_min":1,"base_max":1000000,"base_tick":0.1,"min_notional":1,"price_range":0.1,"created_time":1679297811861,"updated_time":1679380414999}
 * Price filter
 * 
 * price >= quote_min
 * price <= quote_max
 * (price - quote_min) % quote_tick should equal to zero
 * price <= asks[0].price * (1 + price_range) when BUY
 * price >= bids[0].price * (1 - price_range) when SELL
 * 
 * Size filter
 * 
 * base_min <= quantity <= base_max
 * (quantity - base_min) % base_tick should equal to zero
 * 
 * Min Notional filter
 * 
 * price * quantity should greater than min_notional
 */
export default function Sell({ pair, market, dontShow, setDontShow, checkIt }: any) {
	const token0 = pair?.symbol?.split("_")[2];
	const token1 = pair?.symbol?.split("_")[1];
	const [initalCheck, setInitialCheck] = React.useState('');
	const [orderType, setOrderType] = React.useState("1");
	const [hidden, setHidden] = React.useState(false);

	const { account, addOrder, balances, tokens, pairs, trades, orderbook, accountInfo } = useContext(DataContext);
	const { exchangeRate: price, setExchangeRate: setPrice } =
		useContext(AppDataContext);

	const [quoteAmount, setQuoteAmount] = React.useState("0");
	const [baseAmount, setBaseAmount] = React.useState("0");


	const balance = () => {
		return (balances[token1]?.holding ?? 0) + (balances[token1]?.pending_short ?? 0);
	};

	const updateQuoteAmount = (e: string) => {
		setQuoteAmount(e);
		if (isValidNS(e)) {
			if (Number(price) > 0) {
				setBaseAmount(Big(Number(e)).div(price).toFixed(tickToPrecision(pair?.base_tick)));
			} else {
				setBaseAmount("0");
			}
		}
	};

	const updateBaseAmount = (e: string) => {
		setBaseAmount(e);
		console.log(tickToPrecision(pair?.quote_tick));
		if (isValidNS(e)) {
			if (Number(price) > 0) {
				setQuoteAmount(Big(Number(e)).times(price).toFixed(tickToPrecision(pair?.quote_tick)));
			} else {
				setQuoteAmount("0");
			}
		}
	};

	useEffect(() => {
		if(trades[pair.symbol] && balances[token1]){
			const _price = trades[pair.symbol][0].executed_price.toFixed(tickToPrecision(pair?.quote_tick));
			setPrice(_price);
			onPriceChange(_price);
			updateBaseAmount((balance()/4).toFixed(tickToPrecision(pair?.base_tick)));
			setInitialCheck(pair.symbol);
		} else {
			onPriceChange(price);
		}
	}, [pair, trades, initalCheck, balances])

	const onPriceChange = (e: string) => {
		setPrice(e);
		if (isValidNS(e)) {
			if (Number(e) > 0) {
				setBaseAmount(
					Big(Number(quoteAmount)).div(Number(e)).toFixed(tickToPrecision(pair?.base_tick))
				);
			} else {
				setBaseAmount("0");
			}
		}
	};

	return (
		<>
			<Flex flexDir={"column"} gap={4} width={"100%"}>
				<Flex flexDir={"column"} gap={1}>
					<Text fontSize={"sm"}>Price ({token1})</Text>
					<NumberInput
						isDisabled={market}
						precision={tickToPrecision(pair?.quote_tick)}
						value={!market ? price : "Place order at market price"}
						onChange={onPriceChange}
					>
						<NumberInputField rounded={0} />
						<NumberInputStepper>
							<NumberIncrementStepper />
							<NumberDecrementStepper />
						</NumberInputStepper>
					</NumberInput>
				</Flex>
				{!market && (
					<Flex flexDir={"column"} gap={1}>
            <Flex justify={"space-between"}>
						<Text fontSize={"sm"}>Amount ({token0})</Text>
						<Text fontSize={"xs"}>
							Min: {(pair.base_min * price).toFixed(tickToPrecision(pair.quote_tick))} {token0}
						</Text>
					</Flex>
						<NumberInput
							precision={tickToPrecision(pair.base_tick)}
							value={quoteAmount}
							onChange={updateQuoteAmount}
						>
							<NumberInputField rounded={0} />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>
					</Flex>
				)}

				<Flex flexDir={"column"} gap={1} mb={1}>
					<Flex justify={"space-between"}>
						<Text fontSize={"sm"}>Total ({token1})</Text>
						<Text fontSize={"xs"}>Balance: {balance().toFixed(tickToPrecision(pair.base_tick))} {token1}</Text>

					</Flex>

					<NumberInputWithSlider
						max={balance()}
						tick={pair?.base_tick}
						asset={token1}
						onUpdate={updateBaseAmount}
						value={baseAmount}
						color="sell.400"
					/>
				</Flex>

				{!market && <>
				<Divider mt={1} mb={2} />
				<Flex mb={2} justify={"space-between"}>
					<CheckboxGroup>
						<Stack direction="row">
							{Object.keys(ORDERTYPES).map((key) => (
								<Checkbox
									colorScheme={"primary"}
									key={key}
									onChange={() =>
										orderType == key
											? setOrderType("1")
											: setOrderType(key)
									}
									isChecked={orderType == key}
								>
									<Tooltip
										label={ORDER_DESCRIPTIONS[key]}
										bg={"background.700"}
										maxW="200px"
										color="white"
									>
										<Text
											cursor={'help'}
											fontSize={"sm"}
											textDecor={"underline"}
											textUnderlineOffset="2px"
											textDecorationStyle={"dotted"}
										>
											{ORDERTYPES[key].split("_").join(" ")}
										</Text>
									</Tooltip>
								</Checkbox>
							))}
						</Stack>
					</CheckboxGroup>
					<Flex gap={2} align="center">
						<Switch
							isChecked={hidden}
							onChange={() => setHidden(!hidden)}
							size='sm'
							colorScheme={'primary'}
						/>
						<Tooltip
							label="Order would be hidden from the orderbook"
							bg={"background.700"}
							maxW="200px"
							color="white"
						>
							<Text
								cursor={"help"}
								fontSize={"sm"}
								textDecor={"underline"}
								textUnderlineOffset="2px"
								textDecorationStyle={"dotted"}
							>
								Hidden
							</Text>
						</Tooltip>
					</Flex>
				</Flex></>}

				<SellButton
					quoteAmount={quoteAmount}
					baseAmount={baseAmount}
					price={price}
					pair={pair}
					token0={token0}
					token1={token1}
					balance={balance}
					market={market}
					orderType={orderType}
					hidden={hidden}
					dontShow={dontShow}
					setDontShow={setDontShow}
					checkIt={checkIt}
				/>

				<Flex justify={'space-between'}>
					<Tooltip
						placement="bottom"
						p={0}
						bg="background.600"
						// closeDelay={1000}
						label={
							<>
								<Box
									color={"white"}
									p={2}
									px={3}
									bg={"whiteAlpha.100"}
								>
									<Flex justify={"space-between"}>
										<Box textAlign={"right"}>
											<Text
												fontWeight={"bold"}
												color={"primary.400"}
											>
												Tier {accountInfo.tier}
											</Text>
										</Box>
									</Flex>
									<Text fontSize={"xs"}>
										Maker Fee:{" "}
										{(100 * accountInfo.maker_fee_rate) /
											BASIS_POINTS}{" "}
										%
									</Text>
									<Text fontSize={"xs"}>
										Taker Fee:{" "}
										{(100 * accountInfo.taker_fee_rate) /
											BASIS_POINTS}{" "}
										%
									</Text>
								</Box>
							</>
						}
					>
						<Flex
							align="center"
							gap={1}
							_hover={{ cursor: "help" }}
						>
							<HiOutlineReceiptPercent size={16} />
							<Text fontSize={"sm"}>Fees</Text>
						</Flex>
					</Tooltip>

					<Checkbox size={'sm'} isChecked={!dontShow as boolean} onChange={checkIt} colorScheme='primary'>Show Confirmation</Checkbox>
				</Flex>
			</Flex>
		</>
	);
}
