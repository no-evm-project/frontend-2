import { FAUCET } from "@/constants";
import { DataContext } from "@/contexts/DataProvider";
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import React, { useContext } from "react";

export default function TestTokens() {
	const { account } = useContext(DataContext);
	const [loading, setLoading] = React.useState(false);

	const claim = () => {
		setLoading(true);
		account?.wallet
			?.signAndSendTransaction({
				receiverId: FAUCET,
				actions: [
					{
						type: "FunctionCall",
						params: {
							methodName: "get_tokens",
							args: {
								account_id: account.accountId,
							},
							gas: "100000000000000",
							deposit: "0",
						},
					},
				],
			})
			.then(() => {
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};
	return (
		<>
			<Flex justify={"center"} align="center" gap={2}>
				<Image
					className="name-group"
					rounded={"full"}
					src={`https://oss.woo.network/static/symbol_logo/USDC.png`}
					w={6}
					alt={"USDC"}
				/>
				<Text fontSize={"sm"}>Get Testnet 1000 USDC</Text>
				<Button
					isLoading={loading}
					loadingText="Sign the transaction"
					size={"sm"}
					onClick={claim}
                    rounded='full'
					bg={'background.400'}
					_hover={{ bg: "background.300" }}
				>
					Claim
				</Button>
			</Flex>
		</>
	);
}
