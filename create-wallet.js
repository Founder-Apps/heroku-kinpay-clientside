"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWallet = void 0;
const core_1 = require("@kin-sdk/core");
/**
 * Simple helper method to create a Wallet structure, based on our intent
 * @param {"create" | "import" | "watch"} type
 * @param {Wallet} from
 * @returns {Wallet}
 */
function createWallet(type, from = {}) {
    switch (type) {
        case 'create': {
            const keys = core_1.Keypair.randomKeys();
            return Object.assign(Object.assign({}, from), keys);
        }
        case 'import': {
            const keys = core_1.Keypair.fromSecret(from.secret);
            return Object.assign(Object.assign({}, from), keys);
        }
        case 'watch':
            return Object.assign(Object.assign({}, from), { secret: '' });
    }
}
exports.createWallet = createWallet;
//# sourceMappingURL=create-wallet.js.map