import { alchemy, contractNftAddr } from "../client";

export default function handler(req, res) {
  const { tokenId } = req.query;

  return new Promise((resolve, reject) => {
    alchemy.nft
      .getTransfersForContract(contractNftAddr, { order: "desc" })
      .then((response) => {
        const transfersForToken = getTransfersForToken(tokenId, response.nfts);
        res.status(200).json(transfersForToken);
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

const getTransfersForToken = (queryTokenId, contractTransfers) => {
  let transfers = [];

  contractTransfers.forEach((transfer) => {
    const { tokenId: transferTokenId } = transfer;
    if (transferTokenId.toString() === queryTokenId.toString()) {
      transfers.push(transfer);
    }
  });

  return transfers;
};
