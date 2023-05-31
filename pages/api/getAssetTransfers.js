import { alchemy, contractMarketAddr, contractNftAddr } from "./client";

export default function handler(req, res) {
  return new Promise((resolve, reject) => {
    alchemy.core
      .getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: "0x3e890eA47Ba58aa34c39515851a5bbbFEd4e79EB",
        // fromAddress: contractNftAddr,
        category: ["external", "erc20", "erc721", "erc1155"],
        excludeZeroValue: false,
        withMetadata: true,
      })
      .then((response) => {
        res.status(200).json(response);
        resolve();
      })
      .catch((error) => {
        console.error(
          `Error trying to retrieve NFT sales history: ${error.message}`
        );
        res.status(405).json(`Error trying to retrieve NFT sales history`);
        resolve();
      });
  });
}
