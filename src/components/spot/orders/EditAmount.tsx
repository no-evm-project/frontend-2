import { DataContext } from "@/contexts/DataProvider";
import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Checkbox,
	Flex,
	Heading,
	IconButton,
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
import { AiFillDelete, AiOutlineArrowRight, AiOutlineSwap } from "react-icons/ai";
import { tickToPrecision } from "@/utils";
import { BROKER_ID } from "@/constants";
import { CheckIcon } from "@chakra-ui/icons";

export default function EditOrder({ order, editedAmount, setIsEditingAmount }: any) {
	const { orderbook, account, addOrder, handleExecution } = useContext(DataContext);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState(false);
	const [response, setResponse] = React.useState("");

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
				_onClose();
			})
			.catch((err: any) => {
				console.log(
					"Failed to modify order: ",
					err.response.data.message
				);
			});
    }

	const _onClose = () => {
		setError(false);
		setResponse("");
		setLoading(false);
		onClose();
	};

	return (
		<>
			<IconButton
                variant={"unstyled"}
                size="xs"
                icon={<CheckIcon />}
                onClick={onOpen}
                aria-label={""}
            />
			<Modal isCentered isOpen={isOpen} onClose={_onClose}>
				<ModalOverlay />
				<ModalContent bg={"background.400"}>
					<ModalHeader>Edit Confirmation</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text color={"whiteAlpha.700"}>
							Are you sure you want to edit this order?
						</Text>
						<Box mt={4}>
							<Heading size={"sm"}>Price</Heading>
                            <Flex align={'center'} gap={1}>
                            <Text>
								{order.price} {order.symbol.split("_")[2]}/
								{order?.symbol.split("_")[1]}
							</Text>
                            </Flex>
						</Box>
						<Box mt={4}>
							<Flex>
								<Heading size={"sm"}>Amount</Heading>
								<Tag ml={2} size={"sm"} bg="background.200">
									{order.type}
								</Tag>
								<Tag
									ml={2}
									size={"sm"}
									bg={
										order.side == "BUY"
											? "buy.700"
											: "sell.400"
									}
								>
									{order.side}
								</Tag>
							</Flex>
							<Flex align={'center'} gap={1}>
							<Text>
                                <s>
								{order.quantity} 
                                </s>
							</Text>
                            <AiOutlineArrowRight />
                            <Text>
								{editedAmount} {order?.symbol.split("_")[1]}
							</Text>
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
						<Button variant="ghost" onClick={_onClose}>
							Close
						</Button>
						<Button
							colorScheme="primary"
							bg={"primary.400"}
							color="white"
							ml={3}
							onClick={editAmount}
							loadingText="Editing Order"
							isLoading={loading}
						>
							Confirm
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
