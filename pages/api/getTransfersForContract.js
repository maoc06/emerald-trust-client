import { alchemy, contractNftAddr } from "./client";

export default function handler(req, res) {
  return new Promise((resolve, reject) => {
    alchemy.nft
      .getTransfersForContract(contractNftAddr)
      .then((response) => {
        res.status(200).json(response);
        resolve();
      })
      .catch((error) => {
        console.error(
          `Error trying to retrieve NFT transfers for contract [${error.message}]`
        );
        res
          .status(405)
          .json(`Error trying to retrieve NFT transfers for contract`);
        resolve();
      });
  });
}
