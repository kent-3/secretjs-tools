import 'dotenv/config';
import axios from "axios";
import { Wallet, SecretNetworkClient, fromUtf8 } from "secretjs";
import fs from "fs";
import assert from "assert";
import {} from './store';

var endpoint: string = process.env.GRPC_WEB_URL!;
var chainId: string = process.env.CHAIN_ID!;

