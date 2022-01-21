import { CreateAccountResponse, RequestAirdropResponse, SubmitTransactionResponse } from '@kin-sdk/core';
export declare function handleRequestAirdropResponse(res: RequestAirdropResponse): [string, string?];
export declare function handleCreateAccountResponse(res: CreateAccountResponse): [string, string?];
export declare function handleSubmitTransactionResponse(res: SubmitTransactionResponse): [string, string?];
