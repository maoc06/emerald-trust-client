import { alchemy, contractNftAddr } from "../client";

export default function handler(req, res) {
  const { tokenId } = req.query;

  return new Promise((resolve, reject) => {
    alchemy.nft
      .getOwnersForNft(contractNftAddr, tokenId)
      .then((response) => {
        res.status(200).json(response);
        resolve();
      })
      .catch((error) => {
        console.error(
          `Error trying to get owners for NFTs ${tokenId}: ${error}`
        );
        res.status(405).json(`Error trying to get owners for NFTs ${tokenId}`);
        resolve();
      });
  });
}
