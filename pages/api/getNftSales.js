import { NftSaleMarketplace } from "alchemy-sdk";
import { alchemy } from "./client";

export default function handler(req, res) {
  return new Promise((resolve, reject) => {
    alchemy.nft
      .getNftSales({ marketplace: NftSaleMarketplace.UNKNOWN })
      .then((response) => {
        res.status(200).json(response);
        resolve();
      })
      .catch((error) => {
        console.error(`Error trying to retrieve NFT sales: ${error.message}`);
        res.status(405).json(`Error trying to retrieve NFT sales`);
        resolve();
      });
  });
}
