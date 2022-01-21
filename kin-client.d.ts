import { KinEnvironment, Network } from '@kin-sdk/core';
import { KinAccountBalance, KinAgoraClientOptions } from '../agora/kin-agora-client';
import { SubmitPaymentOptions } from '../agora/submit-payment-options';
export interface AccountBalance {
    kin?: string;
    usd?: string;
    btc?: string;
}
export interface AccountDetails {
    balance: AccountBalance;
    publicKey: string;
    explorerUrl: string;
    error?: string;
}
export interface BalanceResult {
    environment: KinEnvironment;
    duration: number;
    addressMap: {
        [key: string]: AccountDetails;
    };
    addresses: AccountDetails[];
    prices: {
        kin: AccountBalance;
    };
    total: AccountBalance;
}
export interface EnsureAccountOptions {
    backoff?: 'FIXED' | 'EXPONENTIAL' | 'LINEAR';
    delay?: number;
    retries?: number;
    confirmations?: number;
}
export interface Prices {
    kin: {
        btc: number;
        btc_24h_change: number;
        usd: number;
        usd_24h_change: number;
    };
}
export declare function getExplorerUrl(env: KinEnvironment, publicKey: string): string;
export declare function getPrices(): Promise<Prices>;
export interface KinClientOptions extends KinAgoraClientOptions {
    appIndex?: number;
}
export declare class KinClient {
    private readonly network;
    private readonly options;
    private readonly client;
    constructor(network: Network, options?: KinClientOptions);
    getPrices(): Promise<Prices>;
    getExplorerUrl(publicKey: string): string;
    createAccount(secret: string): Promise<[string, string?]>;
    hasTokenAccounts(publicKey: string): Promise<boolean>;
    ensureAccount(secret: string, { backoff, confirmations, delay, retries }: EnsureAccountOptions): Promise<[KinAccountBalance[], string?]>;
    submitPayment(options: SubmitPaymentOptions): Promise<[string, string?]>;
    requestAirdrop(publicKey: string, amount: string): Promise<[string, string?]>;
    resolveTokenAccounts(publicKey: string): Promise<[KinAccountBalance[], string?]>;
    getBalances(publicKey: string): Promise<[KinAccountBalance[], string?]>;
}
