// run `tsc` any time you modify this file to transpile it to javascript
import { Wallet, SecretNetworkClient } from "secretjs";
import fs from "fs";
// Create a client to interact with the network
export const initializeClient = async (endpoint, chainId, mnemonic) => {
    const wallet = new Wallet(mnemonic);
    const accAddress = wallet.address;
    const client = await SecretNetworkClient.create({
        grpcWebUrl: endpoint,
        chainId: chainId,
        wallet: wallet,
        walletAddress: accAddress,
    });
    const { balance } = await client.query.bank.balance({
        address: client.address,
        denom: "uscrt",
    });
    console.log(`Initialized client A with wallet address: ${accAddress}`);
    console.log(`Current SCRT balance: ${Number(balance.amount) / 1e6}`);
    return client;
};
// Simulate storing a contract to estimate the gas required
export const simulateStoreContract = async (client, contractPath) => {
    var _a;
    const wasmCode = fs.readFileSync(contractPath);
    console.log("Simulating uploading contract...");
    const sim = await client.tx.compute.storeCode.simulate({
        wasmByteCode: wasmCode,
        sender: client.address,
        source: "",
        builder: "", // you should really include this :)
    });
    const gasUsed = (_a = sim.gasInfo) === null || _a === void 0 ? void 0 : _a.gasUsed;
    ;
    console.log(`Estimated Gas Used: ${gasUsed}`);
};
// Store a new contract on testnet
export const storeContract = async (client, contractPath) => {
    const wasmCode = fs.readFileSync(contractPath);
    console.log("Uploading contract...");
    const uploadReceipt = await client.tx.compute.storeCode({
        wasmByteCode: wasmCode,
        sender: client.address,
        source: "",
        builder: "",
    }, {
        gasLimit: 2000000,
    });
    if (uploadReceipt.code !== 0) {
        console.log(`Failed to get code id: ${JSON.stringify(uploadReceipt.rawLog)}`);
        throw new Error(`Failed to upload contract`);
    }
    const codeIdKv = uploadReceipt.jsonLog[0].events[0].attributes.find((a) => {
        return a.key === "code_id";
    });
    const gasWanted = uploadReceipt.gasWanted;
    console.log("Gas Wanted: ", gasWanted);
    const gasUsed = uploadReceipt.gasUsed;
    console.log("Gas Used: ", gasUsed);
    const codeId = Number(codeIdKv.value);
    console.log("Contract codeId: ", codeId);
    const contractCodeHash = await client.query.compute.codeHash(codeId);
    console.log(`Contract hash: ${contractCodeHash}`);
};
