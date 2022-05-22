import 'dotenv/config';
import { SecretNetworkClient } from "secretjs";
import { initializeClient, simulateStoreContract, storeContract } from '../functions.js';

const endpoint: string = process.env.GRPC_WEB_URL!;
const chainId: string = process.env.CHAIN_ID!;
const mnemonic: string = process.env.MNEMONIC!;

const client: SecretNetworkClient = await initializeClient(endpoint, chainId, mnemonic);

// run this simulate store function first to estimate the gas cost to upload
await simulateStoreContract(client,"contract.wasm.gz"); // modify the path as needed

// uncomment this line when ready to store the contract for real
// await storeContract(client,"contract.wasm.gz"); // modify the path as needed
