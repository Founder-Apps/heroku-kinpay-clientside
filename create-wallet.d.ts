import { Wallet } from '@kin-sdk/core';
/**
 * Simple helper method to create a Wallet structure, based on our intent
 * @param {"create" | "import" | "watch"} type
 * @param {Wallet} from
 * @returns {Wallet}
 */
export declare function createWallet(type: 'create' | 'import' | 'watch', from?: Wallet): Wallet;
