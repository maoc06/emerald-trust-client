import { alchemy, contractNftAddr } from "../client";

export default function handler(req, res) {
  const { address } = req.query;

  return new Promise((resolve, reject) => {
    alchemy.nft
      .getNftsForOwner(address, { contractAddresses: [contractNftAddr] })
      .then((response) => {
        res.status(200).json(response);
        resolve();
      })
      .catch((error) => {
        console.error(
          `Error trying to get alls NFTs for owner ${address}: ${error}`
        );
        res
          .status(405)
          .json(`Error trying to get alls NFTs for owner ${address}`);
        resolve();
      });
  });
}
