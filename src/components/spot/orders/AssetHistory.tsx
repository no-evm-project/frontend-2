import { DataContext } from "@/contexts/DataProvider";
import { Badge, Box, Flex, IconButton, Tag, Tooltip } from "@chakra-ui/react";
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
import { ASSET_NAMES, EXPLORER_URL } from '../../../constants';
import Link from "next/link";


export default function OrderHistory() {
	const { assetHistory, pairs, refresh } = useContext(DataContext);

	const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
		initialState: { currentPage: 1 },
		pagesCount: Math.ceil(
			(assetHistory.length) / 3 
		),
	});

	return (
		<>
		{
			assetHistory.length > 0 ? (
				<>
				<TableContainer>
					<Table variant="simple" size={"sm"}>
						<Thead>
							<Tr>
								<Th borderColor={'whiteAlpha.100'}>Created On</Th>
								<Th borderColor={'whiteAlpha.100'}>Asset</Th>
								<Th borderColor={'whiteAlpha.100'}>Type</Th>
								<Th borderColor={'whiteAlpha.100'}>Amount</Th>
								<Th borderColor={'whiteAlpha.100'}>Status</Th>
								<Th borderColor={'whiteAlpha.100'} isNumeric>Tx</Th>
							</Tr>
						</Thead>
						<Tbody>
							{assetHistory.slice(
										(currentPage - 1) * 3,
										(currentPage - 1) * 3 + 3
									).map((order: any, index: number) => {
                                return (
									<Tr key={index} h='57px'>
										{/* {JSON.stringify(order)} */}
                                        
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
										<Td borderColor={'whiteAlpha.100'}>
										    <Flex gap={1}>
                                                <Image rounded={"full"}
											src={`https://oss.woo.network/static/symbol_logo/${order.token}.png`}
											w={8}
											alt={order.token}/>
                                            <Box>
                                                <Text fontSize={'sm'}>{ASSET_NAMES[order.token]}</Text>
                                                <Text fontSize={'xs'}>{order.token}</Text>
                                            </Box>

                                            </Flex>
										</Td>
										<Td borderColor={'whiteAlpha.100'}>
                                            <Badge>{order.side}</Badge>
                                        </Td>
										<Td borderColor={'whiteAlpha.100'}>
											 {order.amount} {order.token}
										</Td>
                                        <Td borderColor={'whiteAlpha.100'}>
                                            <Badge>{order.trans_status}</Badge>
                                        </Td>
										<Td borderColor={'whiteAlpha.100'} isNumeric>
                                            <Link href={EXPLORER_URL+`/transactions/${order.tx_id}`} target='_blank'>
                                            <Text>
                                            {order.tx_id.slice(0, 4)+'...'+order.tx_id.slice(-4)}
                                            </Text>
                                            </Link>
                                        </Td>
										{/* <Td borderColor={'whiteAlpha.100'} isNumeric>{order.quantity || (order.amount / order.average_executed_price).toFixed(tickToPrecision(pair?.base_tick))}</Td> */}
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
					<Text color={"gray"}>No History Found</Text>
				</Box></>)

		}
				

		</>
	);
}
