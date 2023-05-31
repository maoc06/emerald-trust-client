import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  readContracts,
  useWaitForTransaction,
} from "wagmi";
import { formatEther, parseEther } from "viem";

import { useDebounce } from "../hooks/useDebounce";
import {
  addressNFT,
  abiNFTMarket,
  addressNFTMarket,
  abiNFT,
} from "../contracts";
import { formatMidDotsAddr } from "../utils/formatAddress";
import { ModalEditToken } from "../components";

export default function MyNFTs() {
  const ref = useRef(null);
  const router = useRouter();
  const { address: ownerAddr } = useAccount();

  const [myNfts, setMyNfts] = useState({});
  const [nftCheckToList, setNftCheckToList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [tokenToList, setTokenToList] = useState({
    tokenId: "",
    price: "",
  });
  const [tokenToUnlist, setTokenToUnlist] = useState(null);
  const [tokenToApprove, setTokenToApprove] = useState(null);
  // const [tokenEdit, setTokenEdit] = useState(null);

  const debouncedTokenToList = useDebounce(tokenToList, 500);
  const debouncedTokenToUnlist = useDebounce(tokenToUnlist, 500);
  const debouncedTokenToApprove = useDebounce(tokenToApprove, 500);

  // APPROVE TOKEN
  const { config: configApprove } = usePrepareContractWrite({
    address: addressNFT,
    abi: abiNFT,
    functionName: "approve",
    args: [addressNFTMarket, debouncedTokenToApprove],
    enabled: Boolean(debouncedTokenToApprove),
  });
  const { write: approve, data: tokenApproved } =
    useContractWrite(configApprove);
  const { isSuccess: isSuccessApproved } = useWaitForTransaction({
    hash: tokenApproved?.hash,
  });

  // LISTED NFT
  const { config: configListItem } = usePrepareContractWrite({
    address: addressNFTMarket,
    abi: abiNFTMarket,
    functionName: "listItem",
    args: [
      addressNFT,
      debouncedTokenToList.tokenId,
      parseEther(debouncedTokenToList.price),
    ],
    enabled: Boolean(
      debouncedTokenToList.tokenId && debouncedTokenToList.price
    ),
  });
  const { write: listItem, data: tokenListing } =
    useContractWrite(configListItem);
  const { isSuccess: isSuccessListing } = useWaitForTransaction({
    hash: tokenListing?.hash,
  });

  // CANCEL LIST NFT
  const { config: configCancelListing } = usePrepareContractWrite({
    address: addressNFTMarket,
    abi: abiNFTMarket,
    functionName: "cancelListing",
    args: [addressNFT, debouncedTokenToUnlist],
    enabled: Boolean(debouncedTokenToUnlist),
  });
  const { write: cancelListing, data: tokenCancel } =
    useContractWrite(configCancelListing);
  const { isSuccess: isSuccessCancel } = useWaitForTransaction({
    hash: tokenCancel?.hash,
  });

  const getAllsNFTsOwner = async () => {
    setIsLoading(true);

    let multiCallConfig = [];
    let auxMyNft = {};
    let resNfts = await fetch(`/api/getNftsForOwner/${ownerAddr}`);

    resNfts = await resNfts.json();
    resNfts = resNfts?.ownedNfts || [];

    resNfts.forEach((myNft) => {
      const { tokenId } = myNft;

      auxMyNft[tokenId] = myNft;

      // get -> is token listing?
      multiCallConfig.push({
        address: addressNFTMarket,
        abi: abiNFTMarket,
        functionName: "getListing",
        args: [tokenId],
      });

      // get  -> is token approve to listing?
      multiCallConfig.push({
        address: addressNFT,
        abi: abiNFT,
        functionName: "isApproved",
        args: [addressNFTMarket, tokenId],
      });
    });

    let nftDataStorage = await readContracts({ contracts: multiCallConfig });
    let prevTokenId = null;

    nftDataStorage.forEach(({ status, result }) => {
      if (status === "success") {
        if (typeof result === "object") {
          prevTokenId = parseInt(result.tokenId, "16");
          if (prevTokenId > 0) {
            auxMyNft[prevTokenId]["isListed"] = result.currentlyListed;
            auxMyNft[prevTokenId]["mintHash"] = result.txHash;
            auxMyNft[prevTokenId]["currPrice"] = formatEther(result.price);
          }
        } else if (typeof result === "boolean" && prevTokenId > 0) {
          auxMyNft[prevTokenId]["isApproved"] = result;
        }
      }
    });

    setMyNfts(auxMyNft);
    setIsLoading(false);
  };

  const handleToggleApproveNFT = (e, { tokenId, isApproved }) => {
    if (isApproved) {
      toast.info(
        "At the moment it is not possible to remove the approval from the marketplace.",
        {
          position: "top-right",
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
      return;
    }
    setTokenToApprove(tokenId);
  };

  const handleToggleListNFT = (e, { tokenId, price, isApproved }) => {
    if (!isApproved) {
      toast.error(`The token #${tokenId} is not approved for listing!`, {
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

    const listNft = e.target.checked;
    setNftCheckToList(listNft);

    listNft
      ? setTokenToList({ ...tokenToList, tokenId, price })
      : setTokenToUnlist(tokenId);
  };

  const changeIsListedUI = (tokenId, status, property = "isListed") => {
    let nfts = myNfts;
    let nftToList = nfts[tokenId];
    nftToList[property] = status;
    nfts[tokenId] = nftToList;
    setMyNfts(nfts);
  };

  // APPROVE NFT
  useEffect(() => {
    if (debouncedTokenToApprove && typeof approve === "function") {
      approve();
    }
  }, [debouncedTokenToApprove, approve]);

  // LIST NFT
  useEffect(() => {
    if (
      nftCheckToList &&
      debouncedTokenToList.tokenId &&
      typeof listItem === "function"
    ) {
      listItem();
    }
  }, [debouncedTokenToList, listItem]);

  // CANCEL LISTING NFT
  useEffect(() => {
    if (
      !nftCheckToList &&
      debouncedTokenToUnlist &&
      typeof cancelListing === "function"
    ) {
      cancelListing();
    }
  }, [debouncedTokenToUnlist, cancelListing]);

  // SHOW TOAST SUCCESS CANCEL LISTING TOKEN
  useEffect(() => {
    if (isSuccessCancel) {
      changeIsListedUI(debouncedTokenToUnlist, false);
      setTokenToUnlist(null);
      toast.success("The token was removed to the marketplace! 😞", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }, [isSuccessCancel]);

  // SHOW TOAST SUCCESS LISTING TOKEN
  useEffect(() => {
    if (isSuccessListing) {
      changeIsListedUI(debouncedTokenToList.tokenId, true);
      setTokenToList({ tokenId: "", price: "" });

      toast.success("The token has been added to the marketplace!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }, [isSuccessListing]);

  // SHOW TOAST SUCCESS APPROVED TOKEN
  useEffect(() => {
    if (isSuccessApproved) {
      changeIsListedUI(debouncedTokenToApprove, true, "isApproved");
      setTokenToApprove(null);

      toast.success("Approved token listing!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }, [isSuccessApproved]);

  useEffect(() => {
    getAllsNFTsOwner();
  }, []);

  return (
    <div className="w-full flex pt-2 pb-16 lg:px-6">
      <ModalEditToken
        visible={openEditModal}
        setVisible={setOpenEditModal}
        token={tokenToList}
      />

      {isLoading && (
        <div className="relative px-10 top-0 left-0 text-white text-center text-xl font-bold flex flex-col justify-center items-center inset-0 z-50 h-full w-full">
          <lottie-player
            id="loadingMarketplaceNFTs"
            ref={ref}
            autoplay
            loop
            mode="normal"
            src="/animations/loading.json"
            style={{ width: "300px", height: "300px" }}
          ></lottie-player>
        </div>
      )}

      {!isLoading && (
        <div className="w-full h-auto relative overflow-hidden shadow-md shadow-slate-900 rounded-lg">
          <div className="flex flex-col sm:flex-row md:items-center justify-between bg-gray-900 px-6 py-2">
            <h5 className="text-white text-xl font-bold tracking-tight mb-2 md:mb-0">
              List of your NFTs
            </h5>

            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="table-search-users"
                className="block p-2 pl-10 text-sm  border rounded-lg w-80  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search NFT"
              />
            </div>
          </div>

          {Object.keys(myNfts).length === 0 && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pl-6 py-4 text-center text-lg">
              <p className="text-red-400">You do not have NFT yet.</p>

              <button
                onClick={() => router.push("/mint-nft")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded-xl my-4"
              >
                Mine your NFT NOW
              </button>
            </div>
          )}

          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400 overflow-auto">
              <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Token id
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Emerald NFT
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Approved
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Listed
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {Object.keys(myNfts).length > 0 &&
                  Object.keys(myNfts).map((myNftKey) => {
                    const {
                      tokenId,
                      currPrice,
                      rawMetadata: metadata,
                      title,
                      isApproved,
                      isListed,
                      mintHash,
                    } = myNfts[myNftKey];

                    return (
                      <tr
                        key={tokenId}
                        className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600 cursor-pointer"
                      >
                        <th className="px-6 py-4">{tokenId}</th>

                        <td
                          scope="row"
                          className="flex items-center px-6 py-4 whitespace-nowrap text-white"
                        >
                          <Image
                            className="w-10 h-10 rounded-full border-solid border border-slate-600 bg-gray-700"
                            width={172}
                            height={172}
                            src={metadata?.image}
                            alt={`Picture of your NFT ${
                              title || "default title"
                            }`}
                          />
                          <div className="pl-3">
                            <div className="text-base font-semibold truncate max-w-[200px]">
                              {title}
                            </div>
                            <Link
                              href={`https://mumbai.polygonscan.com/tx/${mintHash}`}
                              className="font-normal text-gray-400 hover:text-white"
                              target="_blank"
                            >
                              {formatMidDotsAddr(mintHash)}
                            </Link>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {currPrice || "0.00"} MATIC
                        </td>

                        <td className="px-6 py-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              value={isApproved}
                              checked={isApproved}
                              className="sr-only peer"
                              onChange={(e) => {
                                handleToggleApproveNFT(e, {
                                  tokenId,
                                  isApproved,
                                });
                              }}
                            />
                            <div className="w-11 h-6 bg-slate-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            {/* <span className="ml-3 text-sm font-medium text-gray-300">
                          {isApproved ? "Approved" : "Not Approved"}
                        </span> */}
                          </label>
                        </td>

                        <td className="px-6 py-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              // disabled={!isApproved}
                              type="checkbox"
                              value={isListed}
                              checked={isListed}
                              className="sr-only peer"
                              onChange={(e) =>
                                handleToggleListNFT(e, {
                                  tokenId: tokenId,
                                  price: currPrice,
                                  isApproved: isApproved,
                                })
                              }
                            />
                            <div className="w-11 h-6 bg-slate-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            {/* <span className="ml-3 text-sm font-medium text-gray-300">
                          {isListed ? "NFT Listed" : "NFT Unlisted"}
                        </span> */}
                          </label>
                        </td>

                        <td className="px-6 py-4">
                          <div
                            className="font-medium text-emerald-600 hover:underline"
                            onClick={(e) => {
                              setOpenEditModal(true);
                              setTokenToList({
                                tokenId: tokenId,
                                price: currPrice,
                              });
                            }}
                          >
                            Edit
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
