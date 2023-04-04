export const CONTRACT_ID = "asset-manager.orderly.testnet";
export const FAUCET = "ft-faucet-usdc.orderly.testnet";
export const NETWORK_ID = "testnet";
export const BROKER_ID = "zexe_dex";
export const API_ENDPOINT = "https://testnet-api.orderly.org";
export const BASIS_POINTS = 10000;

export namespace WS_IDS {
    export const ORDERBOOK_REQUEST = "ob_req";
    export const ORDERBOOK_UPDATE = "ob_update";
    export const TRADE = 'trade'
    export const BBOS_SUBSCRIPTION = "bbos_sub";
    export const _24H_TICKERS_SUBSCRIPTION = "tickers_sub";
}

export namespace WS_TOPICS {
    export const ORDERBOOK_UPDATE = "orderbook";
    export const TRADE = 'trade';
    export const BBOS = "bbos";
    export const TICKERS = "tickers";
}

export const ASSET_NAMES: any = {
    "ETH": "Ethereum",
    "WBTC": "Wrapped Bitcoin",
    "USDC": "USD Coin",
    "LINK": "Chainlink",
    "SWEAT": "Sweatcoin",
    "REF": "Ref Finance",
    "WOO": "Woo Token",
    "AURORA": "Aurora",
    "NEAR": "Near Protocol",
}

export const ORDERTYPES: any = {
    '2': 'IOC',
    '3': 'FOK',
    '4': 'POST_ONLY',
}

export const ORDER_DESCRIPTIONS: any = {
    '2': 'Immediate or Cancel: It matches as much as possible at the order_price. If not fully executed, then remaining quantity will be cancelled',
    '3': 'Fill or Kill: The order can be fully executed at the order_price then the order gets fully executed otherwise would be cancelled without any execution',
    '4': 'The order will be executed with any maker trades at the time of placement, then it will be cancelled without any execution',
}