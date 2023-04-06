import { BROKER_ID, ORDERTYPES } from "@/constants";
import { DataContext } from "@/contexts/DataProvider";
import {
    Alert,
	AlertIcon,
	Box,
	Button,
	Checkbox,
	Flex,
	Heading,
	Tag,
	useDisclosure,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Text,
} from "@chakra-ui/react";
import { AiOutlineSwap } from "react-icons/ai";
import { tickToPrecision } from "@/utils";

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
export default function BuyButton({
	quoteAmount,
	baseAmount,
	price,
	pair,
	token0,
	token1,
	balance,
	market,
	orderType,
	hidden,
    dontShow,
    setDontShow,
    checkIt
}: any) {
	const { orderbook, account, addOrder } = useContext(DataContext);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState(false);
	const [response, setResponse] = React.useState("");

	const validate = (): ValidationResult => {
		if(Number(baseAmount) == 0 && Number(quoteAmount) == 0){
			return {
				valid: false,
				message: `Enter an amount`,
			};
		} else if (Number(baseAmount) < pair?.base_min) {
			return {
				valid: false,
				message: `Minimum order quantity is ${pair?.base_min} ${token1}`,
			};
		} else if (Number(baseAmount) > pair?.base_max) {
			return {
				valid: false,
				message: `Maximum order quantity is ${pair?.base_max} ${token1}`,
			};
		} else if (Number(baseAmount) > balance()) {
			return {
				valid: false,
				message: `Insufficient ${token1} balance`,
			};
		} else if(market) {
			return {
				valid: true,
				message: `Place Market Order`,
			}
		} else if (Number(price) < pair?.base_min * price) {
			return {
				valid: false,
				message: `Minimum order amount is ${(pair?.base_min * price).toFixed(tickToPrecision(pair?.base_tick))} ${token1}`,
			};
		} else if (Number(price) > pair?.quote_max) {
			return {
				valid: false,
				message: `Maximum order amount is ${pair?.quote_max} ${token1}`,
			};
		} 
		// (price - quote_min) % quote_tick should equal to zero
		else if (pair?.quote_min > 0 && Number(price) - pair?.quote_min % pair?.quote_tick !== 0) {
			return {
				valid: false,
				message: `Price must be a multiple of ${pair?.quote_tick}`,
			};
		}
		else if (Number(price) < orderbook[pair?.symbol]?.bids[0][0] * (1 - pair?.price_range)) {
			return {
				valid: false,
				message: `Price is too high`,
			};
		} else if(Number(price) * Number(baseAmount) < pair?.min_notional){
			return {
				valid: false,
				message: `Minimum notional is ${pair?.min_notional} ${token1}`,
			};
		} else {
			return {
				valid: true,
				message: "Place Buy Order",
			};
		}
	}

    const sell = () => {
		let params: any;
        setLoading(true);
		if (market) {
			params = {
				order_quantity: Number(baseAmount).toString(),
				order_type: "MARKET",
				side: "SELL",
				symbol: pair?.symbol,
				broker_id: "zexe_dex",
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
				side: "SELL",
				symbol: pair?.symbol,
				broker_id: "zexe_dex",
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
                _onClose();
			})
			.catch((err: any) => {
				setLoading(false);
				setError(true);
				setResponse(err.response.data.message);
			});
	};

	const _onOpen = () => {
		localStorage.getItem("dontShowConfirmation") ? sell() : onOpen();
	};

	const _onClose = () => {
		setError(false);
		setResponse("");
		setLoading(false);
		onClose();
	};

	return (
		<>
			<Button
				onClick={_onOpen}
				size="md"
				bg={"background.300"}
				_hover={{ bg: "background.500" }}
				isDisabled={!validate().valid}
			>
				{validate().message}
			</Button>

			<Modal isCentered isOpen={isOpen} onClose={_onClose}>
				<ModalOverlay />
				<ModalContent bg={"background.400"}>
					<ModalHeader>Order Confirmation</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text color={"whiteAlpha.700"}>
							Are you sure you want to place this order?
						</Text>
						<Box mt={4}>
							<Heading size={"sm"}>Price</Heading>
							<Text>
								{price} {pair?.symbol.split("_")[2]}/
								{pair?.symbol.split("_")[1]}
							</Text>
						</Box>
						<Box mt={4}>
							<Flex>
								<Heading size={"sm"}>Amount</Heading>
                                <Tag ml={2} size={"sm"} bg="background.200">
                                    {market
                                        ? "MARKET"
                                        : "LIMIT"}
                                </Tag>
                                {ORDERTYPES[orderType] && <Tag ml={2} size={"sm"} bg="background.200">
										{ ORDERTYPES[orderType] }
									</Tag>}
							</Flex>
							<Flex align={"center"} gap={1}>
								{<Text>
									{baseAmount} {pair?.symbol.split("_")[1]}
								</Text>}
								{!market && <AiOutlineSwap />}
								{!market &&  (
									<Text>
										{quoteAmount}{" "}
										{pair?.symbol.split("_")[2]}
									</Text>
								)}
							</Flex>
						</Box>
                        {error && (
                            <Box mt={4}>
                                <Alert status="error">
                                    <AlertIcon />
                                    {response}
                                </Alert>
                            </Box>
                        )}
					</ModalBody>

					<ModalFooter>
                    <Flex w={'100%'} justify={"space-between"}>
							<Checkbox size={'sm'} isChecked={dontShow as boolean} onChange={checkIt}>Don{"'"}t Show Again</Checkbox>
							<Flex>
								<Button variant="ghost" onClick={_onClose}>
									Close
								</Button>
								<Button
									colorScheme="primary"
									bg={"primary.400"}
									color="white"
									ml={3}
									onClick={sell}
									loadingText="Placing Order"
									isLoading={loading}
								>
									Confirm
								</Button>
							</Flex>
						</Flex>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
