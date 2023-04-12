import { DataContext } from "@/contexts/DataProvider";
import { Box, Button, Flex, IconButton } from "@chakra-ui/react";
import React from "react";
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
    Text
} from "@chakra-ui/react";
import { AiFillDelete, AiFillEdit, AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import {useEffect} from 'react';

import {
	Pagination,
	usePagination,
	PaginationNext,
	PaginationPage,
	PaginationPrevious,
	PaginationContainer,
	PaginationPageGroup,
} from "@ajna/pagination";
import OpenedOrder from "./OpenedOrder";

export default function OpenOrders({pair}: any) {
	const { orders, refresh } = useContext(DataContext);
	const [_orders, setOrders] = React.useState<any>([]);

	useEffect(() => {
		setOrders(orders.filter((order: any) => order.status == "NEW"));
	}, [orders, refresh])

	const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
		initialState: { currentPage: 1 },
		pagesCount: Math.ceil(
			(_orders.length) / 3 
		),
	});

	return (
		<>
				{_orders.length > 0 ? (<> <TableContainer>
					<Table variant="simple" size={"sm"}>
						<Thead>
							<Tr>
								<Th borderColor={'whiteAlpha.100'}>Created On</Th>
								<Th borderColor={'whiteAlpha.100'}>Pair</Th>
								<Th borderColor={'whiteAlpha.100'}>Type</Th>
								<Th borderColor={'whiteAlpha.100'}>Price</Th>
								<Th borderColor={'whiteAlpha.100'}>Filled | Total</Th>
								<Th borderColor={'whiteAlpha.100'} isNumeric>
									{/* <Button size='sm' px={4} variant={'unstyled'}>Cancel All</Button> */}
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							{_orders?.slice(
										(currentPage - 1) * 3,
										(currentPage - 1) * 3 + 3
									).map((order: any, index: number) => {
									return <OpenedOrder order={order} key={index} pair={pair} />
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
								bgColor={page == currentPage ? "whiteAlpha.300": "whiteAlpha.50"}
								color={"gray.400"}
								_hover={{ bgColor: "whiteAlpha.300" }}
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
				</>

				) : (
				<Box mx={4}>
					<Text color={"gray"}>No Active Orders</Text>
				</Box>
			)}

		</>
	);
}
