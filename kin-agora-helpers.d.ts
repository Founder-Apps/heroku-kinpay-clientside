import { SolanaTransaction } from '@kin-sdk/core';
export declare function createSolanaTransaction({ type, publicKey, tokenAccount, destination, kinAmount, memo, tokenProgram, subsidizer, appIndex, }: {
    type: any;
    publicKey: any;
    tokenAccount: any;
    destination: any;
    kinAmount: any;
    memo: any;
    tokenProgram: any;
    subsidizer: any;
    appIndex: any;
}): SolanaTransaction;
