import axios from "axios";
import { Wallet, SecretNetworkClient, fromUtf8 } from "secretjs";
import fs from "fs";

export const initializeClient = async (endpoint: string, chainId: string, mnemonic: string) => {
    const wallet = new Wallet(mnemonic);
    const accAddress = wallet.address;
    const client = await SecretNetworkClient.create({
      // Create a client to interact with the network
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
    console.log(`Current SCRT balance: ${Number(balance!.amount)/1e6}`);
    return client;
  };

// Simulates storing a contract to estimate the gas required
export const simulateStoreContract = async (
    client: SecretNetworkClient,
    contractPath: string
  ) => {
    const wasmCode = fs.readFileSync(contractPath);
    console.log("Simulating uploading contract...");
  
    const sim = await client.tx.compute.storeCode.simulate(
      {
        wasmByteCode: wasmCode,
        sender: client.address,
        source: "", // you should really include this :)
        builder: "", // you should really include this :)
      },
      {
        gasLimit: 2000000,
      }
    );
  
    const gasUsed = sim.gasInfo?.gasUsed;;
    console.log(`Estimated Gas Used: ${gasUsed}`);
  };

// Stores a new contract on testnet
export const storeContract = async (
  client: SecretNetworkClient,
  contractPath: string
) => {
  const wasmCode = fs.readFileSync(contractPath);
  console.log("Uploading contract...");

  const uploadReceipt = await client.tx.compute.storeCode(
    {
      wasmByteCode: wasmCode,
      sender: client.address,
      source: "",
      builder: "",
    },
    {
      gasLimit: 5000000,
    }
  );

  if (uploadReceipt.code !== 0) {
    console.log(
      `Failed to get code id: ${JSON.stringify(uploadReceipt.rawLog)}`
    );
    throw new Error(`Failed to upload contract`);
  }

  const codeIdKv = uploadReceipt.jsonLog![0].events[0].attributes.find(
    (a: any) => {
      return a.key === "code_id";
    }
  );

  const gasWanted = uploadReceipt.gasWanted;
  console.log("Contract codeId: ", gasWanted);

  const gasUsed = uploadReceipt.gasUsed;
  console.log("Contract codeId: ", gasUsed);

  const codeId = Number(codeIdKv!.value);
  console.log("Contract codeId: ", codeId);

  const contractCodeHash = await client.query.compute.codeHash(codeId);
  console.log(`Contract hash: ${contractCodeHash}`);
};