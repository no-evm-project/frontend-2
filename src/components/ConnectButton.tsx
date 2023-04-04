import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import { Button, Flex, Stack, Text } from "@chakra-ui/react";
import BN from "bn.js";
import React, { useCallback, useEffect } from "react";
import { CONTRACT_ID } from "../constants";

import keccak256 from "keccak256";
import { useContext } from "react";
import { DataContext } from "@/contexts/DataProvider";
import { Transaction } from "@near-wallet-selector/core";
import { LocalAccount } from "@/auth/LocalAccount";

import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuItemOption,
	MenuGroup,
	MenuOptionGroup,
	MenuDivider,
  } from '@chakra-ui/react'
import router from "next/router";
import { utils } from "near-api-js";

export default function ConnectButton() {
	const { selector, modal, accounts, accountId } = useWalletSelector();
	const [loading, setLoading] = React.useState<boolean>(false);
	const [refresh, setRefresh] = React.useState<boolean>(false);

	const { initMarket, initUser, pairs, account, setAccount } =
		useContext(DataContext);

	const init = useCallback(async (): Promise<LocalAccount> => {
		return new Promise(async (resolve, reject) => {
			if (!accountId) {
				reject("No account selected");
			} else if (account == null) {
				const nextAccount = new LocalAccount(
					accountId!,
					selector.options.network
				);
				await nextAccount.setBalance();
				if (nextAccount.balance.isZero()) {
					const wallet = await selector.wallet();
					await wallet.signOut();
					reject(
						`Account ID: ${accountId} has not been founded. Please send some NEAR into this account.`
					);
				}
				setAccount(nextAccount);
				resolve(nextAccount);
			} else {
				// subscribeUser(account);
				resolve(account);
			}
		});
	}, [accountId, selector]);

	useEffect(() => {
		setLoading(true);
		initMarket().then(({ pairs, tokens }) => {
			init().then(async (nextAccount) => {
				setAccount(nextAccount);
				setLoading(false);
				handleRegister(nextAccount).then((_account) => {
					initUser(nextAccount, tokens);
				});
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
		});
	}, [accountId, refresh]);

	const handleRegister = (_account: LocalAccount): Promise<LocalAccount> => {
		return new Promise(async (resolve, reject) => {
			const wallet = await selector.wallet();

			_account.setWallet(wallet as any);
			_account.setTradingKey();

			let calls = [
				"storage_balance_bounds",
				"storage_cost_of_announce_key",
				"storage_cost_of_token_balance",
				"get_user_info",
				"user_account_exists",
				"storage_balance_of",
			];
			let args = [
				{},
				{},
				{},
				{ account: accountId! },
				{ user: accountId! },
				{ account_id: accountId! },
			];

			Promise.all(
				calls.map(async (method_name, i) =>
					_account.query(method_name, args[i])
				)
			)
				.then((res): any => {
					res = res.map((r) =>
						JSON.parse(Buffer.from(r.result).toString())
					);
					const txs: Transaction[] = [];
					const STORAGE_BALANCE_BOUNDS: any = res[0];
					const STORAGE_COST_OF_ANNOUNCE_KEY: string = res[1] as any;
					const STORAGE_COST_OF_TOKEN_BALANCE: string = res[2] as any;
					const GET_USER_INFO: any = res[3];
					const USER_ACCOUNT_EXISTS: any = res[4];
					const STORAGE_BALANCE_OF: any = res[5];

					// const storageBalance = new BN(STORAGE_COST_OF_ANNOUNCE_KEY)
					// 	.add(new BN(STORAGE_COST_OF_TOKEN_BALANCE).mul(new BN(10)));

					if (!USER_ACCOUNT_EXISTS) {
						txs.push({
							signerId: _account.accountId,
							receiverId: CONTRACT_ID,
							actions: [
								{
									type: "FunctionCall",
									params: {
										methodName: "storage_deposit",
										args: {
											registration_only: true,
											account_id: _account.accountId!,
										},
										gas: "100000000000000",
										deposit: new BN(STORAGE_BALANCE_BOUNDS.min).toString()					
									},
								},
								{
									type: "FunctionCall",
									params: {
										methodName: "storage_deposit",
										args: {
											account_id: _account.accountId!,
										},
										gas: "100000000000000",
										deposit: utils.format.parseNearAmount("0.1")!.toString()
									},
								},
							],
						});
					} 
					else if (
						new BN(STORAGE_BALANCE_OF.available).lt(
							new BN(STORAGE_BALANCE_BOUNDS.min)
						)
					) {
						txs.push({
							signerId: _account.accountId,
							receiverId: CONTRACT_ID,
							actions: [
								{
									type: "FunctionCall",
									params: {
										methodName: "storage_deposit",
										args: {
											account_id: _account.accountId,
										},
										gas: "100000000000000",
										deposit: utils.format.parseNearAmount("0.1")!.toString()
									},
								},
							],
						});
					}

					if (txs.length > 0) {
						console.log(
							"Account is not registered. Registering now..."
						);
						return wallet.signAndSendTransactions({
							transactions: txs,
						});
					} else {
						// check if orderly key is announced
						let calls = [
							"is_orderly_key_announced",
							"is_trading_key_set",
						];
						let args = [
							{
								user: accountId!,
								orderly_key: _account.orderlyPublicKey,
							},
							{
								user: accountId!,
								orderly_key: _account.orderlyPublicKey,
							},
						];

						Promise.all(
							calls.map(async (method_name, i) =>
								_account.query(method_name, args[i])
							)
						)
							.then(async (res) => {
								res = res.map((r) =>
									JSON.parse(Buffer.from(r.result).toString())
								);

								// return;
								const IS_ORDERLY_KEY_ANNOUNCED = Boolean(
									res[0]
								);
								const IS_TRADING_KEY_SET = Boolean(res[1]);

								// const TRADING_KEY_HASH = (res as any)[2];
								
								console.log("IS_ORDERLY_KEY_ANNOUNCED", IS_ORDERLY_KEY_ANNOUNCED);
								console.log("IS_TRADING_KEY_SET", IS_TRADING_KEY_SET);
								await initKeys(
									IS_ORDERLY_KEY_ANNOUNCED,
									IS_TRADING_KEY_SET,
									_account
								)

								resolve(_account);
							})
							.catch(async (err) => {
								console.log("Error while checking is_orderly_key_announced / is_trading_key_set / get_user_trading_key", err);
								console.log(err.message, txs);
								// if(err.message.includes('orderly key was not announced')){
								// 	await initKeys(false, false, '', _account)
								// 	setRefresh(!refresh)
								// }
							});
					}
				})
				.catch((err) => {
					console.log("Error while checking deposit", err);
				});
		});
	};

	const initKeys = async (IS_ORDERLY_KEY_ANNOUNCED: boolean, IS_TRADING_KEY_SET: boolean, _account: LocalAccount) => {
		const tradingKeyHash = Buffer.from(
			keccak256(
				_account.tradingKey!.slice(
					2
				)
			).toString("hex")
		).toString("base64");

		if (!IS_ORDERLY_KEY_ANNOUNCED) {
			console.log("Announcing orderly key...");
			try {
				await _account.signAndSendTransaction(
					"user_announce_key",
					{}
				);
				console.log(
					"orderly key is announced now🚀"
				);
			} catch (err) {
				console.log(
					"Unable to set orderly key",
					err
				);
			}
		} else {
			console.log(
				"orderly key is announced already🚀"
			);
		}

		if(!IS_TRADING_KEY_SET){
			console.log("Setting trading key...");
			try {
				await _account.signAndSendTransaction(
					"user_request_set_trading_key",
					{
						key: tradingKeyHash
					}
				);
				console.log("trading key is set now🚀");
			} catch (err) {
				console.log(
					"Unable to set trading key",
					err
				);
			}
		} else {
			console.log("trading key is set already🚀");
		}
	}

	const handleSignIn = () => {
		modal.show();
	};

	const handleSignOut = async () => {
		const wallet = await selector.wallet();

		wallet.signOut()
		.then((_) => {
			router.push('/spot');
			window.location.reload();
		})
		.catch((err) => {
			console.log("Failed to sign out");
			console.error(err);
		});
	};

	const handleSwitchWallet = () => {
		modal.show();
	};

	return (
		<>
			{loading && <Text>Loading...</Text>}
			{account ? (
				<Menu>
				<MenuButton as={Button} height={"45px"} _hover={{ bg: "whiteAlpha.50" }} bg='transparent' color={'white'}>
				  {account.accountId}
				</MenuButton>
				<MenuList rounded={0} bg='background2'>
				  <MenuGroup title='Wallet'>
					<MenuItem onClick={handleSwitchWallet} bg={'transparent'} _hover={{bg: 'whiteAlpha.200'}}>Switch Wallet</MenuItem>
					<MenuItem onClick={handleSignOut} bg={'transparent'} _hover={{bg: 'whiteAlpha.200'}}>Sign Out</MenuItem>
				  </MenuGroup>
				  <MenuDivider />
				  <MenuGroup title='Help'>
					<MenuItem bg={'transparent'} _hover={{bg: 'whiteAlpha.200'}}>Docs</MenuItem>
					<MenuItem bg={'transparent'} _hover={{bg: 'whiteAlpha.200'}}>FAQ</MenuItem>
				  </MenuGroup>
				</MenuList>
			  </Menu>
			) : (
				<Button onClick={handleSignIn}>Sign In</Button>
			)}
		</>
	);
}