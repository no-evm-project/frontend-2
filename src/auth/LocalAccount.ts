
import { CONTRACT_ID, NETWORK_ID } from '@/constants';
import { Network } from '@near-wallet-selector/core';
import axios from 'axios';
import BN from 'bn.js';
import { ec as EC, eddsa as EdDSA } from 'elliptic';
import { sha256 } from 'js-sha256';
import { keyStores, providers, transactions, utils, KeyPair, Contract, Account, Connection, Signer } from 'near-api-js';
import { KeyStore } from 'near-api-js/lib/key_stores';
import { AccountView, CodeResult, Provider } from 'near-api-js/lib/providers/provider';
import { Wallet } from 'near-wallet-selector/lib/esm/wallets/Wallet';
import { getOrderlySignature, getParamsSignature } from './utils';

export class LocalAccount {
    public accountId: string;
    public balance: BN = new BN(0);
    public provider: providers.JsonRpcProvider|null = null;
    public orderlyPrivateKey: string|null = null;
    public orderlyPublicKey: string|null = null;
    public tradingKey: string|null = null;
    public tradingKeySecret: string|null = null;
    public wallet: Wallet|null = null;

    constructor(accountId: string, network: Network, orderlyPrivateKey?: string, orderlyPublicKey?: string, tradingKey?: string, tradingKeySecret?: string) {
        this.accountId = accountId;
        this.provider = new providers.JsonRpcProvider({
			url: network.nodeUrl,
		});
        if(orderlyPrivateKey) this.orderlyPrivateKey = orderlyPrivateKey;
        if(orderlyPublicKey) this.orderlyPublicKey = orderlyPublicKey;
        if(tradingKey) this.tradingKey = tradingKey;
        if(tradingKeySecret) this.tradingKeySecret = tradingKeySecret;
    }

    async setBalance() {
        if(!this.provider) throw new Error('Provider not set');
        const { amount } = await this.provider.query<AccountView>({
			request_type: "view_account",
			finality: "final",
			account_id: this.accountId,
		});
		this.balance = new BN(amount);
    }

    /**
     * Create a new orderly trading key pair
     */
    setTradingKey() {
        if(!this.tradingKey || !this.tradingKeySecret) {
            let _tradingKey = localStorage.getItem(
                "orderly:tradingKey:" + this.accountId
            ) ?? undefined;
            let _tradingKeySecret = localStorage.getItem(
                "orderly:tradingKeyPrivate:" + this.accountId
            ) ?? undefined;

            if (!_tradingKey || !_tradingKeySecret) {
                var ec = new EC("secp256k1");
                // generate key pair
                var key = ec.genKeyPair();
                // get hex encoded public key
                this.tradingKey = key.getPublic().encode("hex", false);
                // save to local storage
                localStorage.setItem(
                    "orderly:tradingKey:" + this.accountId,
                    this.tradingKey
                );
                // get hex encoded private key
                this.tradingKeySecret = key.getPrivate().toString(16);
                // save to local storage
                localStorage.setItem(
                    "orderly:tradingKeyPrivate:" + this.accountId,
                    this.tradingKeySecret
                );
            } else {
                this.tradingKey = _tradingKey;
                this.tradingKeySecret = _tradingKeySecret;
            }
        }
    }

    /**
     * Set setWallet
     * @param wallet 
     * @param keyStore 
     * @param network 
     */
    async setWallet(wallet: Wallet, network = NETWORK_ID) {
		
        this.wallet = wallet;

        let _orderlyKey = localStorage.getItem(
            "orderly:orderlyKey:" + this.accountId
        ) ?? undefined;
        let _orderlyKeySecret = localStorage.getItem(
            "orderly:orderlyKeyPrivate:" + this.accountId
        ) ?? undefined;

        if (!_orderlyKey || !_orderlyKeySecret) {
            let keyStore: KeyStore;
            if (wallet.type == "browser") {
                try{
                    keyStore = new keyStores.BrowserLocalStorageKeyStore();
                } catch (err) {
                    throw new Error("Browser key store not supported");
                }
            } else {
                throw new Error("Wallet type not supported");
            }
            const _key = await keyStore.getKey(network, this.accountId);
            _orderlyKey = _key?.getPublicKey().toString();
            _orderlyKeySecret = _key?.toString();

            if(!_orderlyKey || !_orderlyKeySecret) throw new Error('Orderly key pair not set');

            localStorage.setItem(
                "orderly:orderlyKey:" + this.accountId,
                _orderlyKey
            );
            localStorage.setItem(
                "orderly:orderlyKeyPrivate:" + this.accountId,
                _orderlyKeySecret
            );
        }

        this.orderlyPrivateKey = _orderlyKeySecret;
        this.orderlyPublicKey = _orderlyKey;
    }

    createGetRequest(method: 'GET', request: string) {
        if(!this.orderlyPrivateKey || !this.orderlyPublicKey) throw new Error('Orderly key pair not set');
        const timestamp = Date.now();
        return axios.get(
            `https://testnet-api.orderly.org${request}`,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "orderly-timestamp": timestamp,
                    "orderly-account-id": this.accountId,
                    "orderly-key": this.orderlyPublicKey,
                    "orderly-signature": getOrderlySignature(this.orderlyPrivateKey, method, request, timestamp),
                },
            }
        );
    }

    createPostRequest(method: 'PUT' | 'POST' | 'DELETE', request: string, data: any) {
        if(!this.orderlyPrivateKey || !this.orderlyPublicKey) throw new Error('Orderly key pair not set');
        if(!this.tradingKey || !this.tradingKeySecret) throw new Error('Trading key pair not set');
        const timestamp = Date.now();

        data.signature = getParamsSignature(this.tradingKeySecret, data);

        const config = {
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "orderly-account-id": this.accountId,
                "orderly-key": this.orderlyPublicKey,
                "orderly-trading-key": this.tradingKey.slice(2),
                "orderly-signature": getOrderlySignature(this.orderlyPrivateKey, method, request, timestamp, data),
                "orderly-timestamp": timestamp,
            }
        };

        return (axios as any)[method.toLowerCase()](`https://testnet-api.orderly.org${request}`, data, config);
    }

    createDeleteRequest(method: 'PUT' | 'POST' | 'DELETE', request: string, data: any) {
        if(!this.orderlyPrivateKey || !this.orderlyPublicKey) throw new Error('Orderly key pair not set');
        if(!this.tradingKey || !this.tradingKeySecret) throw new Error('Trading key pair not set');
        const timestamp = Date.now();

        data.signature = getParamsSignature(this.tradingKeySecret, data);

        // sort data based on key
        const sortedData = Object.keys(data)
            .sort()
            .reduce((obj: any, key: string) => {
                obj[key] = data[key];
                return obj;
            }, {});


        const queryParams = Object.entries(sortedData)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");
        request += `?${queryParams}`;
        

        const config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "orderly-account-id": this.accountId,
                "orderly-key": this.orderlyPublicKey,
                "orderly-trading-key": this.tradingKey.slice(2),
                "orderly-signature": getOrderlySignature(this.orderlyPrivateKey, method, request, timestamp),
                "orderly-timestamp": timestamp,
            },
            data: {}
        };
        return axios.delete(`https://testnet-api.orderly.org${request}`, {...config});
    }

    async signAndSendTransaction(method: string, params: any, contract = CONTRACT_ID, gas = new BN("100000000000000"), deposit = new BN("0")) {
        if(!this.orderlyPrivateKey || !this.orderlyPublicKey) throw new Error('Orderly key pair not set');
        if(!this.provider) throw new Error('Provider not set');

        const accessKey = await this.provider.query(
            `access_key/${this.accountId}/${this.orderlyPublicKey}`,
            ""
        );

        const orderlyKey = KeyPair.fromString(this.orderlyPrivateKey);

        const nonce = ++(accessKey as any).nonce;
        const block_hash = utils.serialize.base_decode(
            accessKey.block_hash
        );

        const action = transactions.functionCall(
            method,
            params,
            gas,
            deposit
        )

        const transaction =
            transactions.createTransaction(
                this.accountId!,
                orderlyKey.getPublicKey(),
                contract,
                nonce,
                [action],
                block_hash
            );

        const serializedTx = utils.serialize.serialize(
            transactions.SCHEMA,
            transaction
        );

        const serializedTxHash = new Uint8Array(
            sha256.array(serializedTx)
        );

        const signature =
            orderlyKey.sign(serializedTxHash);

        const signedTransaction =
            new transactions.SignedTransaction({
                transaction,
                signature: new transactions.Signature({
                    keyType:
                        transaction.publicKey.keyType,
                    data: signature.signature,
                }),
            });

        // encodes transaction to serialized Borsh (required for all transactions)
        const signedSerializedTx =
            signedTransaction.encode();

        
        // sends transaction to NEAR blockchain via JSON RPC call and records the result
        return this.provider.sendJsonRpc(
            "broadcast_tx_commit",
            [
                Buffer.from(
                    signedSerializedTx
                ).toString("base64"),
            ]
        )
    }

    query(method: string, params: any, contractId = CONTRACT_ID) {
        if(!this.provider) throw new Error('Provider not set');
        return this.provider.query<CodeResult>({
            request_type: "call_function",
            account_id: contractId,
            method_name: method,
            args_base64: Buffer.from(
                JSON.stringify(params)
            ).toString("base64"),
            finality: "optimistic",
        })
    }
}