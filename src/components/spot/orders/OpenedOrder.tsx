import { EditIcon, CloseIcon, CheckIcon } from "@chakra-ui/icons";
import { Box, Td, Tr, Text, Flex, IconButton, Tag } from "@chakra-ui/react";
import React, { useContext } from "react";
import { AiFillDelete } from "react-icons/ai";

import {
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
    Image
} from "@chakra-ui/react";
import { BROKER_ID } from "@/constants";
import { DataContext } from "@/contexts/DataProvider";
import { tickToPrecision } from '../../../utils';
import {useEffect} from 'react';
export default function OpenedOrder({ order, pair }: any) {
	const [isEditingPrice, setIsEditingPrice] = React.useState(false);
	const [isEditingAmount, setIsEditingAmount] = React.useState(false);
	const [editedPrice, setEditedPrice] = React.useState(order.price);
	const [editedAmount, setEditedAmount] = React.useState(order.quantity);
	const { account, handleExecution } = useContext(DataContext);

    useEffect(() => {
        setEditedPrice(order.price);
        setEditedAmount(order.quantity);
    }, [order])

    const editPrice = () => {
        const params: any = {
			broker_id: BROKER_ID,
            order_id: order.order_id,
            symbol: order.symbol,
            order_type: order.type,
            order_price: Number(editedPrice).toString(),
            order_quantity: order.quantity,
            side: order.side,
        };
		if(order.visible == 0){
			params.visible_quantity = 0;
		}
		account
			?.createPostRequest("PUT", "/v1/order", params)
			.then((res: any) => {
				handleExecution({
					...order,
					price: Number(editedPrice)
				});
                order.price = Number(editedPrice);
                setIsEditingPrice(false);
			})
			.catch((err: any) => {
				console.log(
					"Failed to modify order: ",
					err.response.data.message
				);
			});
    }

    const editAmount = () => {
        const params: any = {
            order_id: order.order_id,
            symbol: order.symbol,
			broker_id: BROKER_ID,
            order_type: order.type,
            order_price: order.price,
            order_quantity: Number(editedAmount),
            side: order.side,
        };
		if(order.visible == 0){
			params.visible_quantity = 0;
		}
		account
			?.createPostRequest("PUT", "/v1/order", params)
			.then((res: any) => {
				handleExecution({
					...order,
					quantity: Number(editedAmount)
				});
                order.quantity = Number(editedAmount);
                setIsEditingAmount(false);
			})
			.catch((err: any) => {
				console.log(
					"Failed to modify order: ",
					err.response.data.message
				);
			});
    }

    const cancelOrder = () => {
        const params = {
            order_id: order.order_id,
            symbol: order.symbol,
        };
        account
            ?.createDeleteRequest("DELETE", "/v1/order", params)
            .then((res: any) => {
                console.log(res.data);
                // handleExecution(order);
            })
            .catch((err: any) => {
                console.log(
                    "Failed to cancel order: ",
                    err.response.data
                );
            });
    }

	return (
		<>
			<Tr>
				<Td borderColor={"whiteAlpha.100"}>
					<Box fontSize={"sm"}>
						<Text>
							{new Date(order.created_time)
								.toDateString()
								.slice(4)}
						</Text>
						<Text>
							{new Date(order.created_time)
								.toLocaleString()
								.slice(12)}
						</Text>
					</Box>
				</Td>
				<Td borderColor={"whiteAlpha.100"}>
                    <Flex align={'center'} gap={1}>
                        <Flex>
                <Image
												className="name-group"
												rounded={"full"}
												src={`https://oss.woo.network/static/symbol_logo/${
													order.symbol
														.replace("SPOT_", "")
														.split("_")[0]
												}.png`}
												w={7}
												zIndex={1}
												alt={pair.symbol}
											/>
                                            <Image
												className="name-group"
												rounded={"full"}
												src={`https://oss.woo.network/static/symbol_logo/${
													order.symbol
														.replace("SPOT_", "")
														.split("_")[1]
												}.png`}
												w={5}
                                                h={5}
												zIndex={0}
                                                ml={-2}
												alt={pair.symbol}
											/>
                                            </Flex>
                                            <Text fontWeight={'medium'}>
					{order.symbol.split("_").slice(1).join("/")}
                                            </Text>
                    </Flex>
				</Td>
				<Td borderColor={"whiteAlpha.100"}>
                    <Flex gap={2} align='center'>
                        <Tag bg={order.side == 'BUY' ? 'green2': 'red2'}>
                            <Text fontSize={'xs'} >{order.side}</Text>
                        </Tag>
                        <Text fontSize={'sm'}>{order.type}</Text>
                    </Flex>
				</Td>

				<Td borderColor={"whiteAlpha.100"}>
					<Flex gap={2} align='center'>
						{!isEditingPrice ? (
							<Text>{order.price}</Text>
						) : (
							<NumberInput precision={tickToPrecision(pair.base_tick)} borderColor={'transparent'} bg='whiteAlpha.100' size={"sm"} w='80px' value={editedPrice} onChange={(e) => setEditedPrice(e)}>
								<NumberInputField />
							</NumberInput>
						)}
						{isEditingPrice && (
							<IconButton
								variant={"unstyled"}
								size="xs"
								icon={<CheckIcon />}
								onClick={editPrice}
								aria-label={""}
							/>
						)}
						<IconButton
							variant={"unstyled"}
							size="xs"
							icon={isEditingPrice ? <CloseIcon /> : <EditIcon />}
							onClick={() => setIsEditingPrice(!isEditingPrice)}
							aria-label={""}
						/>
					</Flex>
				</Td>
				<Td borderColor={"whiteAlpha.100"}>
                    <Flex align={'center'} gap={1}>
					<Text>
						{order.executed}
						{" / "}
					</Text>
						<Flex gap={2} align='center'>
						{!isEditingAmount ? (
							<Text>{order.quantity}</Text>
						) : (
							<NumberInput precision={tickToPrecision(pair.base_tick)} borderColor={'transparent'} bg='whiteAlpha.100' size={"sm"} w='80px' value={editedAmount} onChange={(e) => setEditedAmount(e)}>
								<NumberInputField />
							</NumberInput>
						)}
						{isEditingAmount && (
							<IconButton
								variant={"unstyled"}
								size="xs"
								icon={<CheckIcon />}
								onClick={editAmount}
								aria-label={""}
							/>
						)}
						<IconButton
							variant={"unstyled"}
							size="xs"
							icon={isEditingAmount ? <CloseIcon /> : <EditIcon />}
							onClick={() => setIsEditingAmount(!isEditingAmount)}
							aria-label={""}
						/>
					</Flex>
                    </Flex>
				</Td>
				<Td borderColor={"whiteAlpha.100"} isNumeric>
					<Flex justify={"end"}>
						<IconButton
							aria-label="Delete"
							icon={<AiFillDelete />}
							variant="unstyled"
							className="mr-2"
							onClick={cancelOrder}
						/>
					</Flex>
				</Td>
			</Tr>
		</>
	);
}
