"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KinClient = exports.getPrices = exports.getExplorerUrl = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@kin-sdk/core");
const axios_1 = require("axios");
const ts_retry_promise_1 = require("ts-retry-promise");
const kin_agora_client_1 = require("../agora/kin-agora-client");
function getExplorerUrl(env, publicKey) {
    const baseUrl = `https://explorer.solana.com/address/${publicKey}`;
    const params = env === core_1.KinEnvironment.Test ? `?cluster=custom&customUrl=https://local.validator.agorainfra.dev` : '';
    return `${baseUrl}/tokens${params}`;
}
exports.getExplorerUrl = getExplorerUrl;
function getPrices() {
    return axios_1.default
        .get(`https://api.coingecko.com/api/v3/simple/price?ids=kin&vs_currencies=usd%2Cbtc&include_24hr_change=true`)
        .then((res) => res.data);
}
exports.getPrices = getPrices;
class KinClient {
    constructor(network, options = {}) {
        this.network = network;
        this.options = options;
        this.client = new kin_agora_client_1.KinAgoraClient(network === null || network === void 0 ? void 0 : network.env, this.options);
        console.log(`KinClient: ${network === null || network === void 0 ? void 0 : network.name}`, this.options);
    }
    getPrices() {
        return getPrices();
    }
    getExplorerUrl(publicKey) {
        return getExplorerUrl(this.network.env, publicKey);
    }
    createAccount(secret) {
        return this.client.createAccount(secret);
    }
    hasTokenAccounts(publicKey) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const [tokenAccounts] = yield this.client.getBalances(publicKey);
            return !!tokenAccounts;
        });
    }
    ensureAccount(secret, { backoff, confirmations, delay, retries }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            confirmations = confirmations || 5;
            retries = retries || 20;
            delay = delay || 500;
            backoff = backoff || 'LINEAR';
            const owner = core_1.PrivateKey.fromString(secret);
            const publicKey = owner.publicKey().toBase58();
            const hasTokenAccounts = yield this.hasTokenAccounts(publicKey);
            if (!hasTokenAccounts) {
                console.log(`NO token Accounts`, publicKey);
                yield this.createAccount(secret);
                let counter = 0;
                let found = 0;
                try {
                    yield ts_retry_promise_1.retry(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        counter++;
                        console.log(`Finding token Accounts found ${found} of ${confirmations} (attempt ${counter})`);
                        if (found >= confirmations) {
                            console.log(`Found the required amount of token accounts!`);
                            return this.client.getBalances(publicKey);
                        }
                        const foundTokenAccounts = yield this.hasTokenAccounts(publicKey);
                        return new Promise((resolve, reject) => {
                            if (!foundTokenAccounts) {
                                return reject(`No accounts found for ${publicKey}`);
                            }
                            if (foundTokenAccounts) {
                                found++;
                                return reject(`Not enough tokenAccounts found for ${publicKey} `);
                            }
                        });
                    }), { retries, delay, backoff });
                }
                catch (e) {
                    return [null, e];
                }
            }
            else {
                const [tokenAccounts] = yield this.client.getBalances(publicKey);
                console.log(`FOUND token Accounts`, publicKey, tokenAccounts);
                return [tokenAccounts];
            }
        });
    }
    submitPayment(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const [desination, error] = yield this.client.getBalances(options.destination);
            if (error) {
                return [null, error];
            }
            if (!desination.length || !desination[0].account) {
                return [null, `Error fetching balance for Destination Account`];
            }
            return this.client.submitPayment(Object.assign(Object.assign({}, options), { destination: desination[0].account }));
        });
    }
    requestAirdrop(publicKey, amount) {
        return this.client.requestAirdrop(publicKey, amount);
    }
    resolveTokenAccounts(publicKey) {
        console.warn(`DEPRECATED Method 'resolveTokenAccounts'. Use 'getBalances' instead.`);
        return this.getBalances(publicKey);
    }
    getBalances(publicKey) {
        return this.client.getBalances(publicKey);
    }
}
exports.KinClient = KinClient;
//# sourceMappingURL=kin-client.js.map