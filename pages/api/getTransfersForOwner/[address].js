import { alchemy, contractNftAddr } from "../client";

export default function handler(req, res) {
  const { address: owner } = req.query;

  return new Promise((resolve, reject) => {
    getTransactionRaw(owner)
      .then((transactions) => {
        getTransactionData(transactions.nfts)
          .then((transfers) => {
            res.status(200).json(transfers);
            resolve();
          })
          .catch((error) => {
            console.error(
              `Error trying to compleate data transactions for owner ${owner} [${error.message}]`
            );
            res
              .status(405)
              .json(
                `Error trying to compleate data transactions for owner ${owner}`
              );
            resolve();
          });
      })
      .catch((error) => {
        console.error(
          `Error trying transfers for owner ${owner} [${error.message}]`
        );
        res.status(405).json(`Error trying transfers for owner ${owner}`);
        resolve();
      });
  });
}

const getTransactionData = async (arrTransfers) => {
  return new Promise((resolve, reject) => {
    let transfersWithDataTx = [];

    arrTransfers.forEach(async (transfer, index) => {
      const txHash = transfer.transactionHash;
      const txData = await alchemy.transact.getTransaction(txHash);

      transfersWithDataTx.push({
        ...transfer,
        value: txData.value.toHexString(),
      });

      if (index === arrTransfers.length - 1) resolve(transfersWithDataTx);
    });
  });
};

const getTransactionRaw = async (owner) => {
  let category = "FROM";
  let options = {
    contractAddresses: [contractNftAddr],
    tokenType: "ERC721",
  };

  const TXs = await alchemy.nft.getTransfersForOwner(owner, category, options);
  return TXs;
};
