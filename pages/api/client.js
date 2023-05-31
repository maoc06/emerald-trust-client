import { Network, Alchemy } from "alchemy-sdk";

const contractNftAddr = process.env.contractNftAddr;
const contractMarketAddr = process.env.contarctMarketAddr;

const settings = {
  apiKey: process.env.alchemyApiKey,
  network: Network.MATIC_MUMBAI,
};

const alchemy = new Alchemy(settings);

export { alchemy, contractNftAddr, contractMarketAddr };
