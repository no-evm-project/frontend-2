import { EditIcon, CloseIcon, CheckIcon } from "@chakra-ui/icons";
import { Box, Td, Tr, Text, Flex, IconButton, Tag, Tooltip } from "@chakra-ui/react";
import React, { useContext } from "react";
import { AiFillDelete } from "react-icons/ai";

import {
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	Image,
} from "@chakra-ui/react";
import { BROKER_ID } from "@/constants";
import { DataContext } from "@/contexts/DataProvider";
import { tickToPrecision } from "../../../utils";
import { useEffect } from "react";
import DeleteOrder from "./DeleteOrder";
import EditPrice from "./EditPrice";
import EditAmount from "./EditAmount";
import moment from "moment";
export default function OpenedOrder({ order, pair }: any) {
	const [isEditingPrice, setIsEditingPrice] = React.useState(false);
	const [isEditingAmount, setIsEditingAmount] = React.useState(false);
	const [editedPrice, setEditedPrice] = React.useState(order.price);
	const [editedAmount, setEditedAmount] = React.useState(order.quantity);
	const { account, handleExecution } = useContext(DataContext);

	useEffect(() => {
		setEditedPrice(order.price);
		setEditedAmount(order.quantity);
	}, [order]);

	return (
		<>
			<Tr>
				<Td borderColor={"whiteAlpha.100"} maxW='100px'>
				<Tooltip label={moment(order.created_time).format('MMMM Do YYYY, h:mm:ss a')} bg='background.400' color={'white'} m={0} >
					<Box fontSize={"sm"}>
						<Text maxW='100px' wordBreak={'break-word'}>
							{moment(order.created_time)
								.calendar().split(" at ")[0]}
						</Text>
						<Text maxW='100px' wordBreak={'break-word'}>
							{moment(order.created_time)
								.calendar().split(" at ")[1]}
						</Text>
					</Box>
				</Tooltip>
				</Td>
				<Td borderColor={"whiteAlpha.100"}>
					<Flex align={"center"} gap={1}>
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
						<Box>
						<Text fontWeight={"medium"}>
							{order.symbol.split("_")[1]}
						</Text>
						<Text fontSize={'xs'}>
							{order.symbol.split("_")[2]}
						</Text>
						</Box>
					</Flex>
				</Td>
				<Td borderColor={"whiteAlpha.100"}>
					<Flex gap={2} align="center">
						<Tag bg={order.side == "BUY" ? "buy.700" : "sell.400"}>
							<Text fontSize={"xs"}>{order.side}</Text>
						</Tag>
						<Text fontSize={"sm"}>{order.type}</Text>
					</Flex>
				</Td>

				<Td borderColor={"whiteAlpha.100"}>
					<Flex gap={2} align="center">
						{!isEditingPrice ? (
							<Text>{order.price}</Text>
						) : (
							<NumberInput
								precision={tickToPrecision(pair.base_tick)}
								borderColor={"transparent"}
								bg="whiteAlpha.100"
								size={"sm"}
								w="80px"
								value={editedPrice}
								onChange={(e) => setEditedPrice(e)}
							>
								<NumberInputField />
							</NumberInput>
						)}
						{isEditingPrice && (
							<EditPrice
								order={order}
								editedPrice={editedPrice}
								setIsEditingPrice={setIsEditingPrice}
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
					<Flex align={"center"} gap={1}>
						<Text>
							{order.executed}
							{" / "}
						</Text>
						<Flex gap={2} align="center">
							{!isEditingAmount ? (
								<Text>{order.quantity}</Text>
							) : (
								<NumberInput
									precision={tickToPrecision(pair.base_tick)}
									borderColor={"transparent"}
									bg="whiteAlpha.100"
									size={"sm"}
									w="80px"
									value={editedAmount}
									onChange={(e) => setEditedAmount(e)}
								>
									<NumberInputField />
								</NumberInput>
							)}
							{isEditingAmount && (
								<EditAmount
									order={order}
									editedAmount={editedAmount}
									setIsEditingAmount={setIsEditingAmount}
								/>
							)}
							<IconButton
								variant={"unstyled"}
								size="xs"
								icon={
									isEditingAmount ? (
										<CloseIcon />
									) : (
										<EditIcon />
									)
								}
								onClick={() =>
									setIsEditingAmount(!isEditingAmount)
								}
								aria-label={""}
							/>
						</Flex>
					</Flex>
				</Td>
				<Td borderColor={"whiteAlpha.100"} isNumeric>
					<Flex justify={"end"}>
						<DeleteOrder order={order} />
					</Flex>
				</Td>
			</Tr>
		</>
	);
}
