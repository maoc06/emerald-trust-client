import { useEffect, useState } from "react";
import { parseEther } from "viem";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { abiNFTMarket, addressNFT, addressNFTMarket } from "../contracts";
import { useDebounce } from "../hooks/useDebounce";
import { toast } from "react-toastify";

export default function ModalEditToken({
  visible = false,
  setVisible = () => {},
  token,
}) {
  const [formParams, updateFormParams] = useState({
    price: token.price,
  });
  const [newPrice, setNewPrice] = useState("");

  const debouncedNewPrice = useDebounce(newPrice, 500);

  // MINT NFT PREPARE WRITE
  const { config } = usePrepareContractWrite({
    address: addressNFTMarket,
    abi: abiNFTMarket,
    functionName: "updateListing",
    args: [addressNFT, token.tokenId, parseEther(debouncedNewPrice)],
    enabled: Boolean(debouncedNewPrice),
  });
  const { write: updateToken, data: tokenData } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: tokenData?.hash,
  });

  const handleUpdateToken = (e) => {
    e.preventDefault();

    const { price } = formParams;

    if (!price || !token.tokenId) {
      toast.error(`Tan error occurred while trying to update token! 😥`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    // console.log("NEW PRICE:", price);
    setNewPrice(price);
  };

  useEffect(() => {
    if (debouncedNewPrice && typeof updateToken === "function") {
      updateToken();
    }
  }, [debouncedNewPrice, updateToken]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("The token has been updated!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setVisible(false);
      updateFormParams({ price: "" });
      setNewPrice("");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (token.price) {
      updateFormParams({ ...formParams, price: token.price });
    }
  }, [token]);

  if (!visible) return null;
  return (
    <div
      tabindex="-1"
      aria-hidden="true"
      className="bg-slate-900 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-25 fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full max-h-full"
    >
      <div className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[350px]">
        {/* <!-- Modal content --> */}
        <div className="relative rounded-lg shadow bg-slate-900">
          <button
            disabled={isLoading}
            onClick={(e) => setVisible(false)}
            type="button"
            className="absolute top-3 right-2.5 text-gray-300 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800 hover:text-white"
            data-modal-hide="authentication-modal"
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-white">
              Edit Token #{token.tokenId}
            </h3>
            <form className="space-y-6" onSubmit={handleUpdateToken}>
              <div>
                <label
                  for="newPrice"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  New price
                </label>
                <input
                  disabled={isLoading}
                  type="number"
                  name="newPrice"
                  id="newPrice"
                  className="border text-sm rounded-lg focus:ring-emerald-600 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                  placeholder={`${formParams.price} MATIC`}
                  value={formParams.price}
                  step={0.01}
                  min={0.01}
                  max={100}
                  onChange={(e) =>
                    updateFormParams({ ...formParams, price: e.target.value })
                  }
                  required
                />
              </div>

              {/* <!-- Modal footer --> */}
              <div class="flex justify-between items-center pt-4 gap-4 border-t rounded-b border-gray-600">
                <button
                  disabled={isLoading}
                  data-modal-hide="top-right-modal"
                  type="submit"
                  class="flex-1 text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-800"
                >
                  {isLoading ? "Updating..." : "Save"}
                </button>
                <button
                  disabled={isLoading}
                  onClick={(e) => setVisible(false)}
                  data-modal-hide="top-right-modal"
                  type="button"
                  class="flex-1 focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
