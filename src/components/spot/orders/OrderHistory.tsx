import { DataContext } from "@/contexts/DataProvider";
import { Box, Flex, IconButton, Tag, Tooltip } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useContext } from "react";

import {
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
	TableContainer,
    Text,
	Image
} from "@chakra-ui/react";

import {
	Pagination,
	usePagination,
	PaginationNext,
	PaginationPage,
	PaginationPrevious,
	PaginationContainer,
	PaginationPageGroup,
} from "@ajna/pagination";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { tickToPrecision } from '../../../utils';
import moment from "moment";


export default function OrderHistory() {
	const { orders, pairs, refresh } = useContext(DataContext);
	const [_orders, setOrders] = React.useState<any>([]);

	useEffect(() => {
		setOrders(orders.filter((order: any) => (order.status == "FILLED" || order.status == "CANCELLED")));
	}, [orders, refresh])

	const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
		initialState: { currentPage: 1 },
		pagesCount: Math.ceil(
			(_orders.length) / 3 
		),
	});

	const pair = pairs.find((pair: any) => pair.symbol === _orders[0]?.symbol);

	return (
		<>
		{
			_orders.length > 0 ? (
				<>
				<TableContainer>
					<Table variant="simple" size={"sm"}>
						<Thead>
							<Tr>
								<Th borderColor={'whiteAlpha.100'}>Created On</Th>
								<Th borderColor={'whiteAlpha.100'}>Pair</Th>
								<Th borderColor={'whiteAlpha.100'}>Type</Th>
								<Th borderColor={'whiteAlpha.100'}>Status</Th>
								<Th borderColor={'whiteAlpha.100'}>Price</Th>
								<Th borderColor={'whiteAlpha.100'} isNumeric>Quantity</Th>
							</Tr>
						</Thead>
						<Tbody>
							{_orders.slice(
										(currentPage - 1) * 3,
										(currentPage - 1) * 3 + 3
									).map((order: any, index: number) => {
                                if(order.status === "FILLED" || order.status == "CANCELLED") return (
									<Tr key={index} h='57px'>
										<Td borderColor={'whiteAlpha.100'} maxW='100px'>
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
										<Td borderColor={'whiteAlpha.100'}>
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
												alt={order.symbol}
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
												alt={order.symbol}
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
										<Td borderColor={'whiteAlpha.100'}><Flex gap={2} align='center'>
                        <Tag bg={order.side == 'BUY' ? 'buy.700': 'sell.400'}>
                            <Text fontSize={'xs'} >{order.side}</Text>
                        </Tag>
                        <Text fontSize={'sm'}>{order.type}</Text>
                    </Flex></Td>
										<Td borderColor={'whiteAlpha.100'}>
											 {order.status}
										</Td>
										<Td borderColor={'whiteAlpha.100'}>{order.price || order.average_executed_price}</Td>
										<Td borderColor={'whiteAlpha.100'} isNumeric>{order.quantity || (order.amount / order.average_executed_price).toFixed(tickToPrecision(pair?.base_tick))}</Td>
									</Tr>
								);
							})}
						</Tbody>
					</Table>
				</TableContainer>

				<Pagination
				pagesCount={pagesCount}
				currentPage={currentPage}
				onPageChange={setCurrentPage}
				>
				<PaginationContainer justify={"space-between"} mt={2} mx={4}>
					<PaginationPrevious
						fontSize={"sm"}
						height={"35px"}
						bgColor="whiteAlpha.50"
						color={"gray.400"}
						_hover={{ bgColor: "whiteAlpha.200" }}
						minW="100px"
					>
						<AiOutlineArrowLeft />{" "}
						<Text ml={2}>Previous</Text>
					</PaginationPrevious>
					<PaginationPageGroup>
						{pages.map((page: number) => (
							<PaginationPage
								height={"35px"}
								bgColor="whiteAlpha.50"
								color={"gray.400"}
								_hover={{ bgColor: "whiteAlpha.200" }}
								minW="40px"
								key={`pagination_page_${page}`}
								page={page}
							/>
						))}
					</PaginationPageGroup>
					<PaginationNext
						fontSize={"sm"}
						height={"35px"}
						bgColor="whiteAlpha.50"
						color={"gray.400"}
						_hover={{ bgColor: "whiteAlpha.200" }}
						minW="100px"
					>
						<Text mr={2}>Next</Text> <AiOutlineArrowRight />
					</PaginationNext>
				</PaginationContainer>
				</Pagination>
				
				</>) : (<>
				<Box mx={4}>
					<Text color={"gray"}>No order history</Text>
				</Box></>)

		}
				

		</>
	);
}
