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
import { AiFillDelete, AiOutlineSwap } from "react-icons/ai";
import { tickToPrecision } from "@/utils";

export default function DeleteOrder({ order }: any) {
	const { orderbook, account, addOrder, handleExecution } = useContext(DataContext);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState(false);
	const [response, setResponse] = React.useState("");

	const cancelOrder = () => {
		const params = {
			order_id: order.order_id,
			symbol: order.symbol,
		};
		account
			?.createDeleteRequest("DELETE", "/v1/order", params)
			.then((res: any) => {
				order.status = "CANCELLED";
				handleExecution(order);
				_onClose();
			})
			.catch((err: any) => {
				console.log("Failed to cancel order: ", err.response.data);
			});
	};

	const _onClose = () => {
		setError(false);
		setResponse("");
		setLoading(false);
		onClose();
	};

	return (
		<>
			<IconButton
				aria-label="Delete"
				icon={<AiFillDelete />}
				variant="unstyled"
				className="mr-2"
				onClick={onOpen}
			/>

			<Modal isCentered isOpen={isOpen} onClose={_onClose}>
				<ModalOverlay />
				<ModalContent bg={"background.400"}>
					<ModalHeader>Delete Confirmation</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text color={"whiteAlpha.700"}>
							Are you sure you want to delete this order?
						</Text>
						<Box mt={4}>
							<Heading size={"sm"}>Price</Heading>
							<Text>
								{order.price} {order.symbol.split("_")[2]}/
								{order?.symbol.split("_")[1]}
							</Text>
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
							<Flex align={"center"} gap={1}>
								<Text>
									{order.quantity}{" "}
									{order?.symbol.split("_")[1]}
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
							onClick={cancelOrder}
							loadingText="Deleting Order"
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
