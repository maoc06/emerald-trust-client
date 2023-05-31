import { alchemy, contractNftAddr } from "../client";

export default function handler(req, res) {
  const { tokenId } = req.query;

  return new Promise((resolve, reject) => {
    alchemy.nft
      .getNftMetadata(contractNftAddr, tokenId)
      .then((response) => {
        res.status(200).json(response);
        resolve();
      })
      .catch((error) => {
        console.error(
          `Error trying to retrieve NFT ${tokenId} Metadata: ${error}`
        );
        res
          .status(405)
          .json(`Error trying to retrieve NFT ${tokenId} Metadata`);
        resolve();
      });
  });
}
