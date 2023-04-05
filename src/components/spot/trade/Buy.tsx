import { DataContext } from "@/contexts/DataProvider";
import {
	Box,
	Button,
	Checkbox,
	CheckboxGroup,
	Collapse,
	Flex,
	Input,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
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
import { useEffect } from "react";
import { BASIS_POINTS } from "@/constants";
import { HiOutlineReceiptPercent } from "react-icons/hi2";
import { Radio, RadioGroup, Stack, SlideFade, Divider } from "@chakra-ui/react";
import { ORDERTYPES, ORDER_DESCRIPTIONS, BROKER_ID } from '../../../constants';
import { motion } from "framer-motion";
import { RiArrowDropDownLine } from "react-icons/ri";

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
export default function Buy({ pair, market }: any) {
	const token0 = pair?.symbol?.split("_")[1];
	const token1 = pair?.symbol?.split("_")[2];
	const [initalCheck, setInitialCheck] = React.useState("");
	const [orderType, setOrderType] = React.useState("1");
	const [hidden, setHidden] = React.useState(false);

	const {
		account,
		addOrder,
		balances,
		tokens,
		accountInfo,
		trades,
		orderbook,
	} = useContext(DataContext);
	const { exchangeRate: price, setExchangeRate: setPrice } =
		useContext(AppDataContext);

	const [quoteAmount, setQuoteAmount] = React.useState("0");
	const [baseAmount, setBaseAmount] = React.useState("0");

	const buy = () => {
		let params: any;
		if (market) {
			params = {
				order_amount: Number(quoteAmount),
				order_type: "MARKET",
				side: "BUY",
				symbol: pair?.symbol,
				broker_id: BROKER_ID
			};
		} else {
			let _orderType = 'LIMIT';
			if(Number(orderType) > 1){
				_orderType = ORDERTYPES[orderType];
			}
			
			params = {
				order_price: Number(price).toString(),
				order_quantity: Number(baseAmount).toString(),
				order_type: _orderType,
				side: "BUY",
				symbol: pair?.symbol,
				broker_id: BROKER_ID
			};
			if(hidden){
				params.visible_quantity = '0';
			}
		}
		account
			?.createPostRequest("POST", "/v1/order", params)
			.then((res: any) => {
				console.log("Order created", res.data.data);
				addOrder(res.data.data.order_id);
			})
			.catch((err: any) => {
				console.log(err.response.data.message);
			});
	};

	const balance = () => {
		return (
			(balances[token1]?.holding ?? 0) +
			(balances[token1]?.pending_short ?? 0)
		);
	};

	// console.log(pair);

	const validate = (): ValidationResult => {
		if (Number(baseAmount) == 0 && Number(quoteAmount) == 0) {
			return {
				valid: false,
				message: `Enter an amount`,
			};
		} else if (Number(quoteAmount) < pair?.min_notional) {
			return {
				valid: false,
				message: `Minimum notional is ${pair?.min_notional} ${token1}`,
			};
		} else if (Number(quoteAmount) > balance()) {
			return {
				valid: false,
				message: `Insufficient ${token1} balance`,
			};
		} else if(market) {
			// go thru orderbook and check quoteAmount is sufficient to buy pair.base_min
			if(Number(quoteAmount) < orderbook[pair.symbol]?.asks[0][0] * pair.base_min){
				return {
					valid: false,
					message: `Amount too low`,
				};
			}
			return {
				valid: true,
				message: `Place Market Order`,
			}
		} else if (Number(baseAmount) < pair?.base_min) {
			return {
				valid: false,
				message: `Minimum order quantity is ${pair?.base_min} ${token0}`,
			};
		} else if (Number(baseAmount) > pair?.base_max) {
			return {
				valid: false,
				message: `Maximum order quantity is ${pair?.base_max} ${token0}`,
			};
		} else if (Number(price) < pair?.quote_min) {
			return {
				valid: false,
				message: `Minimum order amount is ${pair?.quote_min} ${token1}`,
			};
		} else if (Number(price) > pair?.quote_max) {
			return {
				valid: false,
				message: `Maximum order amount is ${pair?.quote_max} ${token1}`,
			};
		}
		
		// (price - quote_min) % quote_tick should equal to zero
		else if (
			pair?.quote_min > 0 &&
			Number(price) - (pair?.quote_min % pair?.quote_tick) !== 0
		) {
			return {
				valid: false,
				message: `Price must be a multiple of ${pair?.quote_tick}`,
			};
		} else if (
			Number(price) >
			orderbook[pair?.symbol]?.asks[0][0] * (1 + pair?.price_range)
		) {
			return {
				valid: false,
				message: `Price is too high`,
			};
		} else {
			return {
				valid: true,
				message: "Place Buy Order",
			};
		}
	};

	const updateQuoteAmount = (e: string) => {
		setQuoteAmount(e);
		if (isValidNS(e)) {
			if (Number(price) > 0) {
				setBaseAmount(
					Big(Number(e))
						.div(price)
						.toFixed(tickToPrecision(pair?.base_tick))
				);
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
				setQuoteAmount(
					Big(Number(e))
						.times(price)
						.toFixed(tickToPrecision(pair?.quote_tick))
				);
			} else {
				setQuoteAmount("0");
			}
		}
	};

	useEffect(() => {
		if (
			price == "0" &&
			trades[pair.symbol] &&
			pair.symbol !== initalCheck
		) {
			const _price = trades[pair.symbol][0].executed_price.toFixed(
				tickToPrecision(pair?.quote_tick)
			);
			setPrice(_price);
			onPriceChange(_price);
			setInitialCheck(pair.symbol);
		} else {
			onPriceChange(price);
		}
	}, [price, pair, initalCheck]);

	const onPriceChange = (e: string) => {
		setPrice(e);
		if (isValidNS(e)) {
			if (Number(e) > 0) {
				setBaseAmount(
					Big(Number(quoteAmount))
						.div(Number(e))
						.toFixed(tickToPrecision(pair?.base_tick))
				);
			} else {
				setBaseAmount("0");
			}
		}
	};

	return (
		<>
			<Flex flexDir={"column"} gap={4}>
				<Flex flexDir={"column"} gap={1}>
					<Text fontSize={"sm"}>Price ({token1})</Text>
					<NumberInput
						bg={'background.500'}
						isDisabled={market}
						min={0}
						precision={tickToPrecision(pair?.quote_tick)}
						value={!market ? price : "Place order at market price"}
						onChange={onPriceChange}
						variant="filled"
						border={"1px"}
						borderColor={"gray.700"}
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
								Min: {pair.base_min} {token0}
							</Text>
						</Flex>
						<NumberInput
							bg={'background.500'}
							min={0}
							precision={tickToPrecision(pair.base_tick)}
							value={baseAmount}
							onChange={updateBaseAmount}
							variant="filled"
							border="1px"
							borderColor={"gray.700"}
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
						<Text fontSize={"xs"}>
							Balance:{" "}
							{balance().toFixed(
								tickToPrecision(pair.quote_tick)
							)}{" "}
							{token1}
						</Text>
					</Flex>

					<NumberInputWithSlider
						max={balance()}
						tick={pair.quote_tick}
						asset={token1}
						onUpdate={updateQuoteAmount}
						value={quoteAmount}
						color="buy.700"
					/>
				</Flex>
				
				{!market && <>
				<Divider mt={1} mb={2} />
				<Flex mb={4} justify={"space-between"}>
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
									_selected={{
										borderColor: "primary.500",
									}}
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

				<Button onClick={buy} size="md" bg={'background.300'} _hover={{bg: 'background.500'}} isDisabled={!validate().valid}>
					{validate().message}
				</Button>

				<Box w={"32%"}>
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
				</Box>
			</Flex>
		</>
	);
}
