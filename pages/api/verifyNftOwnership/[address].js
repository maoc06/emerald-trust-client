import { alchemy, contractNftAddr } from "../client";

export default function handler(req, res) {
  const { address: owner } = req.query;

  console.log("params:", { owner, contractNftAddr });

  return new Promise((resolve, reject) => {
    alchemy.nft
      .verifyNftOwnership(owner, contractNftAddr)
      .then((response) => {
        res.status(200).json(response);
        resolve();
      })
      .catch((error) => {
        console.error(
          `Error trying to verify nft owenership of address ${owner}: ${error}`
        );
        res
          .status(405)
          .json(`Error trying to verify nft owenership of address ${owner}`);
        resolve();
      });
  });
}
