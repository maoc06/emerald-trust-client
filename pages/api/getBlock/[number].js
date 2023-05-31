import { alchemy, contractNftAddr } from "../client";

export default function handler(req, res) {
  const { number } = req.query;

  return new Promise((resolve, reject) => {
    alchemy.core
      .getBlock(number)
      .then((response) => {
        res.status(200).json(response);
        resolve();
      })
      .catch((error) => {
        console.error(`Error trying to retrieve bllock #${number}: ${error}`);
        res.status(405).json(`Error trying to retrieve bllock #${number}`);
        resolve();
      });
  });
}
