import axios from "axios";
import React from "react";
import { LocalAccount } from "@/auth/LocalAccount";
import { getOrderlySignature } from "@/auth/utils";
import { API_ENDPOINT, BROKER_ID, WS_IDS, WS_TOPICS } from "@/constants";
import Big from "big.js";
import { ec as EC, eddsa as EdDSA } from 'elliptic';

const DataContext = React.createContext<DataValue>({} as DataValue);

interface DataValue {
	status: "not-fetching" | "fetching" | "fetched" | "error";
	message: string;
	pairs: any[];
	orderbook: any;
	initMarket: () => Promise<{
		pairs: any[];
		tokens: any;
	}>;
	initUser: (account: LocalAccount|null, tokens: any) => void;
	block: number;
	account: LocalAccount | null;
	setAccount: (account: LocalAccount | null) => void;
	bbos: any;
	tickers: any;
	trades: any;
	tokens: any;
	balances: any;
	tokenList: any;
	orders: any;
	addOrder: (order: number) => void;
	feeInfo: any;
	accountInfo: any;
	handleExecution: (order: any) => void;
	userVolume: any;
	refresh: number;
	volumeStat: any;
	notifications: any;
}

function DataProvider({ children }: any) {
	const [status, setStatus] =
		React.useState<DataValue["status"]>("not-fetching");
	const [message, setMessage] = React.useState<DataValue["message"]>("");
	const [pairs, setPairs] = React.useState<DataValue["pairs"]>([]);
	const [orderbook, setOrderbook] = React.useState<DataValue["orderbook"]>({});
	const [block, setBlock] = React.useState<DataValue["block"]>(0);
	const [account, setAccount] = React.useState<LocalAccount | null>(null);
	const [refresh, setRefresh] = React.useState<number>(0);
	const [networkStatus, setNetworkStatus] = React.useState<any>({});
	const [tokens, setTokens] = React.useState<any>({});
	const [bbos, setBBOS] = React.useState<any>({});
	const [tickers, setTickers] = React.useState<any>({});
	const [trades, setTrades] = React.useState<any>({});
	const [balances, setBalances] = React.useState<any>({});
	const [tokenList, setTokenList] = React.useState<any>([]);
	const [orders, setOrders] = React.useState<any>([]);
	const [feeInfo, setFeeInfo] = React.useState<any>({});
	const [accountInfo, setAccountInfo] = React.useState<any>({});
	const [userVolume, setUserVolume] = React.useState<any>({});
	const [volumeStat, setVolumeStat] = React.useState<any>({});
	const [notifications, setNotifications] = React.useState<any>([]);

	const [isSubscribedToMarket, setIsSubscribedToMarket] = React.useState<boolean>(false);

	React.useEffect(() => {
		if(pairs.length > 0 && Object.keys(balances).length > 0 && account && !isSubscribedToMarket){
			subscribeMarket(account);
			setIsSubscribedToMarket(true);
		}
	}, [account, pairs, balances]);

	const initMarket = () : Promise<any> => {
		console.log("Init market");
		return new Promise((resolve, reject) => {
			if(status === "fetching") reject("Alredy fetching");
			setStatus("fetching");
			Promise.all([
				axios.get(API_ENDPOINT + "/v1/public/info"), 
				axios.get(API_ENDPOINT + "/v1/public/system_info"), 
				axios.get(API_ENDPOINT + "/v1/public/token"), 
				axios.get(API_ENDPOINT + "/v1/public/fee/program"),
				axios.get(API_ENDPOINT + "/v1/public/volume/stats?broker_id=" + BROKER_ID)
			])
				.then(async (res) => {
					const _pairs = res[0].data.data.rows;
					setPairs(_pairs);
					setNetworkStatus(res[1].data);	
					// 1 sec wait
					await new Promise((resolve) => setTimeout(resolve, 1500));	
					_setTrades(_pairs);	
					let _tokens: any = {}
					let _tokenList: any = []
					for(let i in res[2].data.data.rows){
						_tokens[res[2].data.data.rows[i].token] = res[2].data.data.rows[i];
						_tokenList.push(res[2].data.data.rows[i].token);
					}
					console.log(_tokens, _tokenList, _pairs);
					setTokens(_tokens);
					setTokenList(_tokenList);
					setFeeInfo(res[3].data.data.rows);
					setVolumeStat(res[4].data.data);
					setStatus("fetched");
					resolve({pairs: _pairs, tokens: _tokens});
				})
				.catch(async (err) => {
					console.log("Error init:", err, "Trying again...");
					setStatus("error");
					await new Promise(() => setTimeout(initMarket, 2500));
				})
		})
	};

	const initUser = async (_account: LocalAccount|null = account, _tokens = tokens) => {
		if(!_account) return;
		_setOrders(_account);
		_setNotifications(_account);
		Promise.all([_account.createGetRequest("GET", "/v1/client/holding?all=true"), _account.createGetRequest("GET", "/v1/client/info"), _account.createGetRequest("GET", `/v1/volume/user/stats?broker_id=${BROKER_ID}`)])
			.then(async ([res, accountInfo, userVolume]) => {
				const _balances: any = {};
				const balanceRequests = [];
				const _holdings = res.data.data.holding;
				setAccountInfo(accountInfo.data.data);
				setUserVolume(userVolume.data.data);
				for(let i in _holdings){
					_balances[_holdings[i].token] = _holdings[i];
					let tokenId = _tokens[_holdings[i].token].token_account_id;
					if(tokenId != 'near') {
						balanceRequests.push(_account.query("ft_balance_of", {account_id: _account.accountId}, tokenId))
					}
				}
				Promise.all(balanceRequests).then((res) => {
					let index = 0;
					for(let i in _holdings){
						if(_tokens[_holdings[i].token].token_account_id != 'near') {
							const decArray = res[index].result;
							const hexString = decArray.map(num => num.toString(16)).join('');
							const result = Buffer.from(hexString,'hex').toString('utf8');
							_balances[_holdings[i].token].wallet = Big(JSON.parse(result)).toString();
							index++;
						} else {
							_balances[_holdings[i].token].wallet = _account.balance.toString();
						}
					}
					setBalances(_balances);
				})
			}
		)
	}

	const _setOrders = async (_account: LocalAccount) => {
		_account.createGetRequest("GET", `/v1/orders`).then((res) => {
			const _orders = res.data.data.rows;
			setOrders(_orders);
		})
		.catch(err => {
			console.log("Error fetching orders:", err);
			if(err.response.data.code == -1003){
				console.log("Trying again...");
				setTimeout(() => _setOrders(_account), 1500);
			}
		})
	}

	const _setNotifications = async (_account: LocalAccount) => {
		_account.createGetRequest("GET", `/notification/inbox/notifications?size=100&page=0&type=TRADE`).then((res) => {
			console.log("Notifications:", res.data.data);
			const _not = res.data.data.rows;
			setNotifications(_not);
		})
		.catch(err => {
			console.log("Error fetching notifications:", err);
			if(err.message == 'Network Error' || err.response?.data.code == -1003){
				console.log("Trying again...");
				setTimeout(() => _setNotifications(_account), 1500);
			}
		})
	}

	const addOrder = async (orderId: number) => {
		if(!account) return;
		account.createGetRequest("GET", `/v1/order/${orderId}`).then((res) => {
			const _order = res.data.data;
			const _orders = [_order, ...orders];
			setOrders(_orders);
		})
	}

	const _setTrades = (_pairs: any[]) => {
		const tradeRequests = [];
		for(let i in _pairs){
			tradeRequests.push(axios.get(`https://testnet-api.orderly.org/v1/public/market_trades?symbol=${_pairs[i].symbol}&limit=100`));
		}
		// sleep for 1s
		Promise.all(tradeRequests).then((res) => {
			const _trades: any = {};
			for(let i in res){
				_trades[_pairs[i].symbol] = res[i].data.data.rows;
			}
			setTrades(_trades);
		})
		.catch(async (err) => {
			console.log("Error fetching trades:", err, "Trying again...");
			await new Promise(() => setTimeout(() => _setTrades(_pairs), 1500));
		})
	}

	const subscribeMarket = async (account: LocalAccount) => {
		console.log("Subscribing to market");
		const marketWS = new WebSocket(
			"wss://testnet-ws.orderly.org/ws/stream/" + account.accountId
		);

		marketWS.addEventListener("open", function (event) {
			marketWS.send(
				JSON.stringify({
					id: `${WS_IDS.BBOS_SUBSCRIPTION}`,
					topic: WS_TOPICS.BBOS,
					event: "subscribe",
				})
			);
			marketWS.send(
				JSON.stringify({
					id: `${WS_IDS._24H_TICKERS_SUBSCRIPTION}`,
					topic: WS_TOPICS.TICKERS,
					event: "subscribe",
				})
			);
			pairs.map((pair: any) => {
				marketWS.send(
					JSON.stringify({
						id: `${pair.symbol}@${WS_IDS.ORDERBOOK_REQUEST}`,
						event: "request",
						params: {
							type: "orderbook",
							symbol: pair.symbol,
						},
					})
				);
				marketWS.send(
					JSON.stringify({
						id: `${pair.symbol}@${WS_IDS.ORDERBOOK_UPDATE}`,
						topic: `${pair.symbol}@${WS_TOPICS.ORDERBOOK_UPDATE}`,
						event: "subscribe",
					})
				);
				marketWS.send(
					JSON.stringify({
						id: `${pair.symbol}@${WS_IDS.TRADE}`,
						topic: `${pair.symbol}@${WS_TOPICS.TRADE}`,
						event: "subscribe",
					})
				);
			});
		});

		marketWS.addEventListener("message", function (event) {
			const data = JSON.parse(event.data);
			if (data.event == "ping") {
				marketWS.send(
					JSON.stringify({
						event: "pong",
					})
				);
			} else if (data.id) {
				const eventId = data.id;
				const eventIdParsed = eventId.split("@")[1];
				if(eventIdParsed == WS_IDS.ORDERBOOK_REQUEST){
					handleOrderbookRequest(data)
					console.log("Got ORDERBOOK_REQUEST");
				} else if (eventId == WS_IDS.BBOS_SUBSCRIPTION) {
					if(data.success){
						console.log("Subscribed to BBOS_SUBSCRIPTION");
					} else {
						console.warn("Failed to subscribe to BBOS_SUBSCRIPTION", data);
					}
				} 
				else if (eventId == WS_IDS._24H_TICKERS_SUBSCRIPTION) {
					if(data.success){
						console.log("Subscribed to _24H_TICKERS_SUBSCRIPTION");
					} else {
						console.warn("Failed to subscribe to _24H_TICKERS_SUBSCRIPTION", data);
					}
				} 
				else if (eventIdParsed == WS_IDS.ORDERBOOK_UPDATE) {
					if(data.success){
						console.log("Subscribed to", eventId);
					} else {
						console.warn("Failed to subscribe to", eventId, data);
					}
				} else if (eventIdParsed == WS_IDS.TRADE) {
					if(data.success){
						console.log("Subscribed to", eventId);
					} else {
						console.warn("Failed to subscribe to", eventId, data);
					}
				} else {
					console.log(`Unknown id: ${JSON.stringify(data)}`);
				}
			} else if(data.topic) {
				const eventTopic = data.topic;
				const eventTopicParsed = eventTopic.split("@")[1];
				if (eventTopicParsed == WS_TOPICS.ORDERBOOK_UPDATE) {
					handleOrderbookRequest(data)
				} else if (eventTopicParsed == WS_TOPICS.TRADE) {
					handleTradePush(data)
				} else if (eventTopic == WS_TOPICS.BBOS) {
					handleBBOS(data)
				} else if (eventTopic == WS_TOPICS.TICKERS) {
					handle24HTickers(data)
				} else {
					console.log(`Unknown topic: ${JSON.stringify(data)}`);
				}
			} else {
				console.log(`Unknown data: ${JSON.stringify(data)}`);
			}
		});
		
		const userWS = new WebSocket(
			"wss://testnet-ws-private.orderly.org/v2/ws/private/stream/" +
				account.accountId
		);

		userWS.addEventListener("open", function (event) {
			setInterval(
				() =>
					userWS.send(
						JSON.stringify({
							event: "ping",
							params: {},
						})
					),
				7000
			);
			const timestamp = Date.now();

			userWS.send(
				JSON.stringify({
					event: "auth",
					params: {
						orderly_key: account.orderlyPublicKey!,
						sign: getOrderlySignature(
							account.orderlyPrivateKey!,
							"",
							"",
							timestamp,
							null
						),
						timestamp: timestamp,
					},
				})
			);
		});

		userWS.addEventListener("message", function (event) {
			const data = JSON.parse(event.data);
			if (data.event == "ping" || data.event == "pong") {
				userWS.send(
					JSON.stringify({
						event: "pong",
					})
				);
			} else if (data.event == 'auth' && data.success) {
				// Balance
				userWS.send(
					JSON.stringify({
						id: "balance_update",
						event: "subscribe",
						topic: "balance",
					})
				);

				userWS.send(
					JSON.stringify({
						id: "execution_report",
						event: "subscribe",
						topic: "executionreport@zexe_dex",
					})
				);
			} else {
				if(data.topic == 'executionreport@zexe_dex' || data.topic == 'executionreport'){
					handleExecution(data.data)
				} else if(data.topic == 'balance'){
					handleBalance(data.data.balances)
				} else {
					console.log("Unknown user topic", data);
				}
			}
		});
	};

	const handleBalance = (newBalances: any) => {
		const _balances = balances;
		const assets = Object.keys(_balances);
		for(let i = 0; i < assets.length; i++){
			if(newBalances[assets[i]]){
				_balances[assets[i]].holding = newBalances[assets[i]].holding;
				_balances[assets[i]].pending_short = newBalances[assets[i]].pendingShortQty;
			}
		}
		setBalances(_balances);
		setRefresh(Math.random());
	}

	const handleExecution = (order: any) => {
		const _orders = orders;
		for(let i = 0; i < _orders.length; i++){
			if(_orders[i].order_id == order.order_id){
				_orders[i] = order;
			}
		}
		setOrders(_orders);
		setRefresh(Math.random());
	} 

	const handleOrderbookRequest = (event: any) => {
		const _orderbook = orderbook;
		_orderbook[event.data.symbol] = event.data;
		setOrderbook(_orderbook);
		// set bbos
		if(event.data.asks.length > 0 && event.data.bids.length > 0){
			const _bbos = bbos;
			const bbo = {
				symbol: event.data.symbol,
				ask: event.data.asks[0][0],
				askSize: event.data.asks[0][1],
				bid: event.data.bids[0][0],
				bidSize: event.data.bids[0][1],
			}
			_bbos[event.data.symbol] = bbo;
			setBBOS(_bbos);
		}

		setRefresh(Math.random());
	};

	const handleTradePush = (event: any) => {
		const trade = {side: event.data.side, executed_price: event.data.price, executed_quantity: event.data.size};
		// push trade to trades[event.data.symbol] array's start
		const _trades = trades;
		if(!_trades[event.data.symbol]){
			_trades[event.data.symbol] = [];
		}
		_trades[event.data.symbol].unshift(trade);
		setTrades(_trades);
	}

	const handleBBOS = (event: any) => {
		const _bbos = bbos;
		for(let i in event.data){
			_bbos[event.data[i].symbol] = event.data[i];
		}
		setBBOS(_bbos);
	};

	const handle24HTickers = (event: any) => {
		const _24hTickers = tickers;
		for(let i in event.data){
			_24hTickers[event.data[i].symbol] = event.data[i];
		}
		setTickers(_24hTickers);
	};

	return (
		<DataContext.Provider
			value={{ notifications, volumeStat, refresh, feeInfo, userVolume, handleExecution, accountInfo, status, initMarket, initUser, account, setAccount, orderbook, bbos, tickers, message, pairs, block, trades, tokens, tokenList, balances, orders, addOrder }}
		>
			{children}
		</DataContext.Provider>
	);
}

export { DataContext, DataProvider };
