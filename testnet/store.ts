import 'dotenv/config';
import axios from "axios";
import { Wallet, SecretNetworkClient, fromUtf8 } from "secretjs";
import fs from "fs";
import { initializeClient, simulateStoreContract, storeContract } from '../functions.js';

const endpoint: string = process.env.GRPC_WEB_URL!;
const chainId: string = process.env.CHAIN_ID!;
const mnemonic: string = process.env.MNEMONIC!;

const client: SecretNetworkClient = await initializeClient(endpoint, chainId, mnemonic);
await simulateStoreContract(client,"contract.wasm.gz"); // modify the path as needed
await storeContract(client,"contract.wasm.gz"); // modify the path as needed
