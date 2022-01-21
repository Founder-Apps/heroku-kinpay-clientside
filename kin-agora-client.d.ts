import { KinEnvironment } from '@kin-sdk/core';
import { SubmitPaymentOptions } from './submit-payment-options';
export interface KinAgoraClientOptions {
    appIndex?: number;
}
export interface KinAccountBalance {
    account?: string;
    balance?: string;
}
export declare class KinAgoraClient {
    private readonly env;
    private readonly options?;
    private serviceConfig;
    private readonly urls;
    constructor(env: KinEnvironment, options?: KinAgoraClientOptions);
    createAccount(secret: string): Promise<[string, string?]>;
    getBalance(publicKey: string): Promise<[string, string?]>;
    getBalances(publicKey: string): Promise<[KinAccountBalance[], string?]>;
    requestAirdrop(publicKey: string, amount: string): Promise<[string, string?]>;
    submitPayment(options: SubmitPaymentOptions): Promise<[string, string?]>;
    private ensureServiceConfig;
    private handleResolveTokenResponse;
    private getServiceConfigKeys;
    private createAccountTransaction;
    private createAccountRequest;
    private getServiceConfig;
    private getRecentBlockhash;
    private getTokenAccountBalance;
    private submitTransaction;
}
