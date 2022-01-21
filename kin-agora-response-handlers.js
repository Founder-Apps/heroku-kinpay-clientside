"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSubmitTransactionResponse = exports.handleCreateAccountResponse = exports.handleRequestAirdropResponse = void 0;
const core_1 = require("@kin-sdk/core");
function handleRequestAirdropResponse(res) {
    switch (res.getResult()) {
        case core_1.RequestAirdropResponse.Result.OK:
            return ['OK'];
        case core_1.RequestAirdropResponse.Result.NOT_FOUND:
            return [null, 'NOT_FOUND'];
        case core_1.RequestAirdropResponse.Result.INSUFFICIENT_KIN:
            return [null, 'INSUFFICIENT_KIN'];
        default:
            return [null, 'UNEXPECTED_ERROR'];
    }
}
exports.handleRequestAirdropResponse = handleRequestAirdropResponse;
function handleCreateAccountResponse(res) {
    switch (res.getResult()) {
        case core_1.CreateAccountResponse.Result.OK:
            return [core_1.bs58encode(res.getAccountInfo().getAccountId().getValue_asU8()), null];
        case core_1.CreateAccountResponse.Result.EXISTS:
            return [null, 'An account with the randomly generated address exists. Please try again.'];
        case core_1.CreateAccountResponse.Result.PAYER_REQUIRED:
            return [
                null,
                'The transaction to create a token account failed because the transaction subsidizer did not sign the transaction.',
            ];
        case core_1.CreateAccountResponse.Result.BAD_NONCE:
            return [null, 'The transaction to create a token account failed because of a bad nonce. Please try again.'];
        default:
            return [null, 'Something went wrong. Please reload'];
    }
}
exports.handleCreateAccountResponse = handleCreateAccountResponse;
function handleSubmitTransactionResponse(res) {
    switch (res.getResult()) {
        case core_1.SubmitTransactionResponse.Result.OK:
        case core_1.SubmitTransactionResponse.Result.ALREADY_SUBMITTED:
            return [core_1.bs58encode(res.getSignature().getValue_asU8()), null];
        case core_1.SubmitTransactionResponse.Result.FAILED:
            switch (res.getTransactionError().getReason()) {
                case core_1.TransactionError.Reason.UNAUTHORIZED:
                    return [null, 'The transaction failed due to a signature error'];
                case core_1.TransactionError.Reason.BAD_NONCE:
                    return [null, 'The transaction failed because of a bad nonce. Please try again.'];
                case core_1.TransactionError.Reason.INSUFFICIENT_FUNDS:
                    return [null, 'The transaction failed because of insufficient funds.'];
                case core_1.TransactionError.Reason.INVALID_ACCOUNT:
                    return [null, 'The transaction failed because of an invalid account. Please check your account values'];
                default:
                    return [null, 'The transaction failed for an unknown reason'];
            }
        case core_1.SubmitTransactionResponse.Result.REJECTED:
            return [null, 'The transaction was rejected by the configured webhook'];
        case core_1.SubmitTransactionResponse.Result.INVOICE_ERROR:
            return [null, 'The transaction was rejected by the configured webhook because of an invoice error.'];
        case core_1.SubmitTransactionResponse.Result.PAYER_REQUIRED:
            return [null, 'The transaction failed because the transaction subsidizer did not sign the transaction.'];
    }
}
exports.handleSubmitTransactionResponse = handleSubmitTransactionResponse;
//# sourceMappingURL=kin-agora-response-handlers.js.map