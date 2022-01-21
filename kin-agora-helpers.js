"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSolanaTransaction = void 0;
const core_1 = require("@kin-sdk/core");
function createSolanaTransaction({ type, publicKey, tokenAccount, destination, kinAmount, memo, tokenProgram, subsidizer, appIndex, }) {
    const owner = core_1.PublicKey.fromBase58(publicKey).solanaKey();
    let feePayer;
    if (subsidizer) {
        feePayer = new core_1.SolanaPublicKey(subsidizer);
    }
    else {
        feePayer = owner;
    }
    const instructions = [];
    if (memo === null || memo === void 0 ? void 0 : memo.length) {
        instructions.push(core_1.MemoProgram.memo({ data: memo }));
    }
    else if (appIndex) {
        const fk = Buffer.alloc(29);
        const kinMemo = core_1.Memo.new(1, type, appIndex, fk);
        instructions.push(core_1.MemoProgram.memo({ data: kinMemo.buffer.toString('base64') }));
    }
    instructions.push(core_1.TokenProgram.transfer({
        source: core_1.PublicKey.fromBase58(tokenAccount).solanaKey(),
        dest: core_1.PublicKey.fromBase58(destination).solanaKey(),
        owner,
        amount: BigInt(core_1.kinToQuarks(kinAmount.toString())),
    }, new core_1.SolanaPublicKey(tokenProgram)));
    return new core_1.SolanaTransaction({ feePayer: feePayer }).add(...instructions);
}
exports.createSolanaTransaction = createSolanaTransaction;
//# sourceMappingURL=kin-agora-helpers.js.map