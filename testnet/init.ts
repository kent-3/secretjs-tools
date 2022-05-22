import 'dotenv/config';
import axios from "axios";
import fs from "fs";
import { SecretNetworkClient } from "secretjs";
import { initializeClient } from '../functions.js';

const endpoint: string = process.env.GRPC_WEB_URL!;
const chainId: string = process.env.CHAIN_ID!;
const mnemonic: string = process.env.MNEMONIC!;

const client: SecretNetworkClient = await initializeClient(endpoint, chainId, mnemonic);
