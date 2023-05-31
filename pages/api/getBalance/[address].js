import { alchemy } from "../client";

export default function handler(req, res) {
  const { address } = req.query;

  return new Promise((resolve, reject) => {
    alchemy.core
      .getBalance(address)
      .then((response) => {
        res.status(200).json(response);
        resolve();
      })
      .catch((error) => {
        console.error(
          `Error trying to retrieve balance of ${address}: ${error}`
        );
        res.status(405).json(`Error trying to retrieve balance of ${address}`);
        resolve();
      });
  });
}
