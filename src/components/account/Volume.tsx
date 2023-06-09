import { DataContext } from "@/contexts/DataProvider";
import React, { useContext } from "react";

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
	Button,
    Text,
    Flex,
	Image,
	Box,
	Heading,
    Tag
} from "@chakra-ui/react";
import { dollarFormatter, tickToPrecision } from '../../utils';

export default function Volume() {
	const {accountInfo, userVolume, feeInfo } = useContext(DataContext);


	return (
		<Box bg={'background.600'} py={5}>
		<Flex flexDir={'column'} mb='50px' justify='center' px={6}>
			<Heading size={'md'} mt={7}>
				Activity
			</Heading>
			<Flex gap={16} mt={8}>
                <Box>
                <Heading size={'sm'} color='whiteAlpha.700'>
                    Volume 7d
                </Heading>
                <Text mt={1} fontSize={'2xl'}>{dollarFormatter.format(userVolume.volume_last_7_days)}</Text>
                </Box>

                <Box>
                <Heading size={'sm'} color='whiteAlpha.700'>
                    Volume 30d
                </Heading>
                <Text mt={1} fontSize={'2xl'}>{dollarFormatter.format(userVolume.volume_last_30_days)}</Text>
                </Box>

                <Box>
                <Heading size={'sm'} color='whiteAlpha.700'>
                    Volume YTD
                </Heading>
                <Text mt={1} fontSize={'2xl'}>{dollarFormatter.format(userVolume.volume_ytd)}</Text>
                </Box>
			</Flex>
		</Flex>

		{/* <Heading size={'md'} mb={4} px={6}>Fee Info</Heading> */}
			<TableContainer maxW={'1000px'}>
				<Table variant="simple">
					<Thead>
						<Tr>
							<Th borderColor={'whiteAlpha.200'}>Tier</Th>
							<Th borderColor={'whiteAlpha.200'}>30d Volume</Th>
							<Th borderColor={'whiteAlpha.200'}>Maker Fee</Th>
							<Th borderColor={'whiteAlpha.200'} isNumeric>Taker Fee</Th>
						</Tr>
					</Thead>
					<Tbody>
						{Object.keys(feeInfo).map((tokenSymbol: any, index: number) => {
							return (
								<Tr key={index} bg={accountInfo.tier == feeInfo[tokenSymbol].tier ? 'background.500': 'transparent'}>
									<Td borderColor={'whiteAlpha.200'}>
                                        <Flex align={'center'} gap={2}>
                                            <Text>{feeInfo[tokenSymbol].tier}</Text>
                                            {accountInfo.tier == feeInfo[tokenSymbol].tier && <Tag bg={'whiteAlpha.200'}>Your Tier</Tag>}
                                        </Flex>
                                    </Td>
                                    <Td borderColor={'whiteAlpha.200'}>
                                        <Box>
                                            <Text>{dollarFormatter.format(feeInfo[tokenSymbol].volume_min)}</Text>
                                        </Box>
                                    </Td>
                                    <Td borderColor={'whiteAlpha.200'}>
                                        <Box>
                                            <Text>{feeInfo[tokenSymbol].maker_fee}</Text>
                                        </Box>
                                    </Td>
                                    <Td borderColor={'whiteAlpha.200'} isNumeric>
                                        <Box>
                                            <Text>{feeInfo[tokenSymbol].taker_fee}</Text>
                                        </Box>
                                    </Td>
								</Tr>
							);
						})}
					</Tbody>
				</Table>
			</TableContainer>
		</Box>
	);
}
