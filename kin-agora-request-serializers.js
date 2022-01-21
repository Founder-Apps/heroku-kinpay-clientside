"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeSubmitPaymentRequest = exports.serializeSubmitPaymentTransaction = exports.serializeResolveTokenAccountsRequest = exports.serializeMinBalanceReq = exports.serializeSubmitTransactionRequest = exports.serializeGetBalanceRequest = exports.serializeGetTokenAccountBalanceRequest = exports.serializeRequestAirdropRequest = exports.serializeCreateAccountRequest = void 0;
const core_1 = require("@kin-sdk/core");
const kin_agora_helpers_1 = require("./kin-agora-helpers");
function serializeCreateAccountRequest(protoTx) {
    const createReq = new core_1.CreateAccountRequest();
    createReq.setTransaction(protoTx);
    createReq.setCommitment(core_1.Commitment.SINGLE);
    return createReq.serializeBinary();
}
exports.serializeCreateAccountRequest = serializeCreateAccountRequest;
function serializeRequestAirdropRequest(publicKey, amount) {
    const accountId = new core_1.SolanaAccountId();
    accountId.setValue(core_1.PublicKey.fromBase58(publicKey).buffer);
    const req = new core_1.RequestAirdropRequest();
    req.setAccountId(accountId);
    req.setCommitment(core_1.Commitment.SINGLE);
    req.setQuarks(core_1.kinToQuarks(amount).toNumber());
    return req.serializeBinary();
}
exports.serializeRequestAirdropRequest = serializeRequestAirdropRequest;
function serializeGetTokenAccountBalanceRequest(tokenAccount) {
    const req = new core_1.GetAccountInfoRequest();
    req.setAccountId(tokenAccount);
    req.setCommitment(core_1.Commitment.SINGLE);
    return req.serializeBinary();
}
exports.serializeGetTokenAccountBalanceRequest = serializeGetTokenAccountBalanceRequest;
function serializeGetBalanceRequest(publicKey) {
    const accountId = new core_1.SolanaAccountId();
    accountId.setValue(core_1.PublicKey.fromBase58(publicKey).buffer);
    const req = new core_1.GetAccountInfoRequest();
    req.setAccountId(accountId);
    req.setCommitment(core_1.Commitment.SINGLE);
    return req.serializeBinary();
}
exports.serializeGetBalanceRequest = serializeGetBalanceRequest;
function serializeSubmitTransactionRequest(tx) {
    const submitReq = new core_1.SubmitTransactionRequest();
    submitReq.setTransaction(tx);
    submitReq.setCommitment(core_1.Commitment.SINGLE);
    return submitReq.serializeBinary();
}
exports.serializeSubmitTransactionRequest = serializeSubmitTransactionRequest;
function serializeMinBalanceReq() {
    const minBalanceReq = new core_1.GetMinimumBalanceForRentExemptionRequest();
    minBalanceReq.setSize(core_1.AccountSize);
    return minBalanceReq.serializeBinary();
}
exports.serializeMinBalanceReq = serializeMinBalanceReq;
function serializeResolveTokenAccountsRequest(publicKey) {
    const accountID = new core_1.SolanaAccountId();
    accountID.setValue(core_1.PublicKey.fromBase58(publicKey.trim()).buffer);
    const req = new core_1.ResolveTokenAccountsRequest();
    req.setAccountId(accountID);
    return req.serializeBinary();
}
exports.serializeResolveTokenAccountsRequest = serializeResolveTokenAccountsRequest;
function serializeSubmitPaymentTransaction({ secret, tokenAccount, destination, amount, memo, type }, subsidizer, tokenProgram, appIndex) {
    const pk = core_1.PrivateKey.fromSecret(secret);
    const transaction = kin_agora_helpers_1.createSolanaTransaction({
        type: type || core_1.TransactionType.P2P,
        publicKey: core_1.Keypair.fromSecret(secret).publicKey,
        tokenAccount,
        destination,
        kinAmount: amount,
        memo,
        subsidizer,
        tokenProgram,
        appIndex,
    });
    return [pk, transaction];
}
exports.serializeSubmitPaymentTransaction = serializeSubmitPaymentTransaction;
function serializeSubmitPaymentRequest(pk, transaction, resp) {
    transaction.recentBlockhash = core_1.bs58encode(Buffer.from(resp.getBlockhash().getValue_asU8()));
    transaction.partialSign(new core_1.SolanaAccount(pk.secretKey()));
    const protoTx = new core_1.Transaction();
    protoTx.setValue(transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
    }));
    return protoTx;
}
exports.serializeSubmitPaymentRequest = serializeSubmitPaymentRequest;
//# sourceMappingURL=kin-agora-request-serializers.js.map