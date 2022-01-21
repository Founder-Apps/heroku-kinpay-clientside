"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KinAgoraClient = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@kin-sdk/core");
const kin_agora_request_serializers_1 = require("./kin-agora-request-serializers");
const kin_agora_response_handlers_1 = require("./kin-agora-response-handlers");
class KinAgoraClient {
    constructor(env, options) {
        this.env = env;
        this.options = options;
        this.urls = core_1.getAgoraUrls(env);
    }
    createAccount(secret) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.ensureServiceConfig();
            const owner = core_1.PrivateKey.fromString(secret);
            return this.createAccountTransaction(owner).then((tx) => this.createAccountRequest(tx));
        });
    }
    getBalance(publicKey) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return core_1.agoraRequest((_a = this.urls) === null || _a === void 0 ? void 0 : _a.getAccountInfoURL, kin_agora_request_serializers_1.serializeGetBalanceRequest(publicKey))
                .then((res) => core_1.GetAccountInfoResponse.deserializeBinary(res.data))
                .then((response) => {
                var _a;
                return response.getResult() === core_1.GetAccountInfoResponse.Result.NOT_FOUND
                    ? [null, `Account could not be found`]
                    : [(_a = response === null || response === void 0 ? void 0 : response.getAccountInfo()) === null || _a === void 0 ? void 0 : _a.getBalance()];
            });
        });
    }
    getBalances(publicKey) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return core_1.agoraRequest((_a = this.urls) === null || _a === void 0 ? void 0 : _a.getBalancesURL, kin_agora_request_serializers_1.serializeResolveTokenAccountsRequest(publicKey))
                .then((res) => core_1.ResolveTokenAccountsResponse.deserializeBinary(res.data))
                .then((res) => this.handleResolveTokenResponse(res.getTokenAccountsList()));
        });
    }
    requestAirdrop(publicKey, amount) {
        var _a;
        return core_1.agoraRequest((_a = this.urls) === null || _a === void 0 ? void 0 : _a.requestAirdropURL, kin_agora_request_serializers_1.serializeRequestAirdropRequest(publicKey, amount))
            .then((res) => core_1.RequestAirdropResponse.deserializeBinary(res.data))
            .then((res) => kin_agora_response_handlers_1.handleRequestAirdropResponse(res));
    }
    submitPayment(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.ensureServiceConfig();
            const [pk, transaction] = kin_agora_request_serializers_1.serializeSubmitPaymentTransaction(options, this.serviceConfig.subsidizer, this.serviceConfig.tokenProgram, this.options.appIndex);
            return this.getRecentBlockhash().then((resp) => this.submitTransaction(kin_agora_request_serializers_1.serializeSubmitPaymentRequest(pk, transaction, resp)));
        });
    }
    ensureServiceConfig() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.serviceConfig) {
                this.serviceConfig = yield this.getServiceConfig();
            }
        });
    }
    handleResolveTokenResponse(accounts) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (accounts.length == 0) {
                return [null, `No Kin token accounts found`];
            }
            const balances = yield Promise.all(accounts.map((account) => this.getTokenAccountBalance(account)));
            return [balances];
        });
    }
    getServiceConfigKeys(owner) {
        var _a, _b, _c, _d;
        const tokenProgram = new core_1.SolanaPublicKey((_a = this.serviceConfig) === null || _a === void 0 ? void 0 : _a.tokenProgram);
        const tokenKey = new core_1.SolanaPublicKey((_b = this.serviceConfig) === null || _b === void 0 ? void 0 : _b.token);
        const subsidizer = ((_c = this.serviceConfig) === null || _c === void 0 ? void 0 : _c.subsidizer) ? new core_1.SolanaPublicKey((_d = this.serviceConfig) === null || _d === void 0 ? void 0 : _d.subsidizer)
            : owner.publicKey().solanaKey();
        return { tokenKey, tokenProgram, subsidizer };
    }
    createAccountTransaction(owner) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.ensureServiceConfig();
            return this.getRecentBlockhash()
                .then((res) => core_1.bs58encode(Buffer.from(res.getBlockhash().getValue_asU8())))
                .then((recentBlockhash) => {
                var _a;
                return core_1.agoraRequest((_a = this.urls) === null || _a === void 0 ? void 0 : _a.getMinBalanceURL, kin_agora_request_serializers_1.serializeMinBalanceReq())
                    .then((res) => core_1.GetMinimumBalanceForRentExemptionResponse.deserializeBinary(res.data))
                    .then((res) => {
                    const tx = core_1.getCreateAccountTx(recentBlockhash, owner.publicKey().solanaKey(), this.getServiceConfigKeys(owner), res.getLamports());
                    tx.partialSign(new core_1.SolanaAccount(owner.secretKey()));
                    const protoTx = new core_1.Transaction();
                    protoTx.setValue(tx.serialize({ requireAllSignatures: false, verifySignatures: false }));
                    return protoTx;
                });
            });
        });
    }
    createAccountRequest(protoTx) {
        var _a;
        return core_1.agoraRequest((_a = this.urls) === null || _a === void 0 ? void 0 : _a.createAccountURL, kin_agora_request_serializers_1.serializeCreateAccountRequest(protoTx))
            .then((res) => core_1.CreateAccountResponse.deserializeBinary(res.data))
            .then((res) => kin_agora_response_handlers_1.handleCreateAccountResponse(res));
    }
    getServiceConfig() {
        var _a;
        return core_1.agoraRequest((_a = this.urls) === null || _a === void 0 ? void 0 : _a.getServiceConfigURL, new core_1.GetServiceConfigRequest().serializeBinary())
            .then((res) => core_1.GetServiceConfigResponse.deserializeBinary(res.data))
            .then((res) => ({
            tokenProgram: res.getTokenProgram().getValue_asU8(),
            token: res.getToken().getValue_asU8(),
            subsidizer: res.getSubsidizerAccount() ? res.getSubsidizerAccount().getValue_asU8() : undefined,
        }));
    }
    getRecentBlockhash() {
        var _a;
        return core_1.agoraRequest((_a = this.urls) === null || _a === void 0 ? void 0 : _a.getRecentBlockhashURL, new core_1.GetRecentBlockhashRequest().serializeBinary()).then((res) => core_1.GetRecentBlockhashResponse.deserializeBinary(res.data));
    }
    getTokenAccountBalance(tokenAccount) {
        var _a;
        return core_1.agoraRequest((_a = this.urls) === null || _a === void 0 ? void 0 : _a.getAccountInfoURL, kin_agora_request_serializers_1.serializeGetTokenAccountBalanceRequest(tokenAccount))
            .then((res) => core_1.GetAccountInfoResponse.deserializeBinary(res.data))
            .then((res) => ({
            account: new core_1.PublicKey(Buffer.from(tokenAccount.getValue_asU8())).toBase58(),
            balance: core_1.quarksToKin(res.getAccountInfo().getBalance()),
        }));
    }
    submitTransaction(tx) {
        var _a;
        return core_1.agoraRequest((_a = this.urls) === null || _a === void 0 ? void 0 : _a.submitTransactionURL, kin_agora_request_serializers_1.serializeSubmitTransactionRequest(tx))
            .then((res) => core_1.SubmitTransactionResponse.deserializeBinary(res.data))
            .then((res) => kin_agora_response_handlers_1.handleSubmitTransactionResponse(res));
    }
}
exports.KinAgoraClient = KinAgoraClient;
//# sourceMappingURL=kin-agora-client.js.map