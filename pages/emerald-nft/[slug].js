import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { formatEther, parseEther } from "viem";
import { ShareIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import {
  readContracts,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { PolygonIcon } from "../../components";
import { addressNFTMarket, abiNFTMarket, addressNFT } from "../../contracts";
import { useDebounce } from "../../hooks/useDebounce";
import {
  formatEndDotsAddr,
  formatMidDotsAddr,
} from "../../utils/formatAddress";
import { formatTxDate } from "../../utils/formatDate";
import { toast } from "react-toastify";

export default function EmeraldNFT({ ...props }) {
  const ref = useRef(null);
  const router = useRouter();
  const [nft, setNft] = useState({ currPrice: "0.0" });
  const [transfers, setTransfers] = useState([]);
  const [owner, setOwner] = useState("0x0");
  const [mintHash, setMintHash] = useState("0x0");
  const [showMoreDesc, setShowMoreDesc] = useState(false);

  const debouncedNftPrice = useDebounce(nft.currPrice, 500);

  // BUY NFT PREPARE WRITE
  const { config, isError: isErrorToBuy } = usePrepareContractWrite({
    address: addressNFTMarket,
    abi: abiNFTMarket,
    functionName: "buyItem",
    args: [addressNFT, router.query.slug],
    value: parseEther(debouncedNftPrice),
  });

  // BUY NFT WRITE
  const { write: buyEmeraldNft, data: emeraldNft } = useContractWrite(config);

  // BUY NFT WAIT TX
  const { isLoading: isLoadingBuy, isSuccess: isSuccessBuy } =
    useWaitForTransaction({ hash: emeraldNft?.hash });

  const getNFTMetadata = async () => {
    let multiCallConfig = [];
    let tokenId, resNft, nftDataStorage;

    tokenId = router.query.slug;
    if (tokenId) {
      resNft = await fetch(`/api/getNftMetadata/${tokenId}`);
      resNft = await resNft.json();

      // get -> curr price
      multiCallConfig.push({
        address: addressNFTMarket,
        abi: abiNFTMarket,
        functionName: "getListing",
        args: [tokenId],
      });

      nftDataStorage = await readContracts({ contracts: multiCallConfig });
      const { status, result } = nftDataStorage[0];
      if (status === "success") {
        resNft["currPrice"] = formatEther(result.price);
      }

      setNft(resNft);
    }
  };

  const getTransfers = async () => {
    const tokenId = router.query.slug;
    let _transfers = [];
    let blockNumber, blockData;

    let resTransfers = await fetch(`/api/getTransferToken/${tokenId}`);
    resTransfers = await resTransfers.json();

    for (let index = 0; index < resTransfers.length; index++) {
      blockNumber = resTransfers[index].blockNumber;

      blockData = await fetch(`/api/getBlock/${blockNumber}`);
      blockData = await blockData.json();

      if (String(resTransfers[index].from).startsWith("0x000000")) {
        setMintHash(resTransfers[index].transactionHash);
      }

      _transfers.push({
        blockNumber: blockNumber,
        from: resTransfers[index].from,
        to: resTransfers[index].to,
        tokenId: resTransfers[index].tokenId,
        transactionHash: resTransfers[index].transactionHash,
        timestamp: blockData.timestamp,
      });
    }

    setTransfers(_transfers);
  };

  const getOwnerNFT = async () => {
    let response = await fetch(`/api/getOwnersForNft/${router.query.slug}`);
    response = await response.json();
    const owner = response.owners[0];
    setOwner(owner);
  };

  const getBalanceAccount = async (accountAddress) => {
    let balance = await fetch(`/api/getBalance/${accountAddress}`);
    balance = await balance.json();
    balance = parseInt(balance.hex, "16");
    return formatEther(balance);
  };

  const verifyNftOwnership = async () => {
    let isOwnerShip = await fetch(
      `/api/verifyNftOwnership/${props.connectUser}`
    );
    return isOwnerShip.json();
  };

  const handleBuyNFT = async () => {
    if (!props.isConnect) {
      toast.warn("Connect your Web3 Wallet to buy the NFT!", {
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

    const isOwner = await verifyNftOwnership();
    if (isOwner) {
      toast.info("You already own this NFT! 😅", {
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

    const balance = await getBalanceAccount(props.connectUser);
    if (balance < nft.currPrice) {
      toast.warn("You don't have enough funds! 😢", {
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

    if (!isErrorToBuy && typeof buyEmeraldNft === "function") {
      buyEmeraldNft();
    } else {
      toast.error(
        "An error occurred. NFT is not available for purchase at this time 😥",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
    }
  };

  useEffect(() => {
    if (router.isReady) {
      const { slug } = router.query;
      if (!slug) return null;
      getNFTMetadata();
      getOwnerNFT();
      getTransfers();
    }
  }, [router.isReady]);

  return (
    // <div className="flex flex-col gap-8 p-6 lg:px-8 overflow-auto bg-slate-800">
    <div className="w-full xl:min-w-[1280px] md:max-w-7xl">
      {isLoadingBuy && (
        <div className="text-white text-center text-xl font-bold fixed top-0 left-0 flex flex-col justify-center items-center inset-0 z-50 h-full w-full bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-25 bg-slate-950">
          <lottie-player
            id="mintLottie"
            ref={ref}
            autoplay
            loop
            mode="normal"
            src="/animations/emerald.json"
            style={{ width: "300px", height: "300px" }}
          ></lottie-player>

          <p>NFT transfer started, please wait a few seconds...</p>
        </div>
      )}

      {isSuccessBuy && (
        <div className="fixed top-0 left-0 flex justify-center items-center inset-0 z-50 h-full w-full bg-clip-padding backdrop-filter backdrop-blur-lg text-white text-xl bg-opacity-25 bg-slate-950">
          <div className="flex flex-col justify-center items-center">
            <lottie-player
              id="successMint"
              ref={ref}
              autoplay
              count={1}
              src="/animations/success.json"
              style={{ width: "500px", height: "500px" }}
            ></lottie-player>

            <div className="relative -top-36 flex flex-col justify-center items-center">
              <p>Congratulations, you now own the NFT Emerald</p>

              <div className="mt-2">
                <button
                  onClick={() => {
                    router.push("/my-nfts");
                  }}
                  className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl mr-3 cursor-pointer"
                >
                  See my NFTs
                </button>

                <Link
                  href={`https://mumbai.polygonscan.com/tx/${emeraldNft?.hash}`}
                  target="_blank"
                  className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-slate-800 focus:ring-4 focus:ring-gray-100 text-white cursor-pointer"
                >
                  Check out in Polygonscan
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between gap-8 md:p-6 md:px-1 lg:px-8">
        <div className="flex-1 md:max-w-xl max-h-[33rem] bg-gray-600 rounded-3xl overflow-hidden">
          {nft.rawMetadata && (
            <Image
              src={nft.rawMetadata?.image || "/gem-default.png"}
              alt={`Picture of Emerald NFT #${router.query.slug}`}
              width={600}
              height={600}
              className="object-cover min-w-full min-h-full h-full"
            />
          )}
        </div>

        <div className="flex flex-col justify-between flex-1 md:max-w-xl text-white">
          <div>
            <div className="flex text-gray-400 text-sm mb-4">
              <Link
                target="_blank"
                href={`https://mumbai.polygonscan.com/tx/${mintHash}`}
                className="flex gap-2 items-center cursor-pointer hover:text-gray-200 mr-12"
              >
                <PolygonIcon />
                <p className="relative -left-2">Polygonscan</p>
              </Link>

              <Link
                href="#"
                className="flex gap-2 items-center cursor-pointer hover:text-gray-200"
              >
                <ShareIcon className="h-5 w-5" />
                <p>Share</p>
              </Link>
            </div>

            <h5 className="mb-2 text-2xl font-bold tracking-tight">
              {nft.title || "default title"}
            </h5>

            <div className="flex gap-4 flex-row sm:gap-16">
              <Link
                href={`https://mumbai.polygonscan.com/address/${nft.rawMetadata?.minedBy}`}
                className="flex gap-2 items-center mb-2 w-fit"
                target="_blank"
              >
                <UserCircleIcon className="h-12 w-12 text-emerald-200 cursor-pointer" />

                <div className="flex flex-col text-gray-300 cursor-pointer">
                  <span className="text-sm">Mined by</span>
                  <p className="font-bold">
                    {nft.rawMetadata?.minedBy
                      ? formatMidDotsAddr(nft.rawMetadata?.minedBy)
                      : "UNKNOWN"}
                  </p>
                </div>
              </Link>

              <Link
                href={`https://mumbai.polygonscan.com/address/${owner}`}
                className="flex gap-2 items-center mb-2 w-fit"
                target="_blank"
              >
                <UserCircleIcon className="h-12 w-12 text-emerald-200 cursor-pointer" />

                <div className="flex flex-col text-gray-300 cursor-pointer">
                  <span className="text-sm">Owner</span>
                  <p className="font-bold">
                    {owner === "0x0" ? "UNKNOWN" : formatMidDotsAddr(owner)}
                  </p>
                </div>
              </Link>
            </div>

            <hr className="my-4 h-0.5 border-t-0 bg-gray-600 opacity-50" />

            <div>
              <p className={showMoreDesc ? "line-clamp-none" : "line-clamp-3"}>
                {nft.description}
              </p>
              <span
                className="text-emerald-600 font-semibold hover:underline cursor-pointer"
                onClick={(e) => setShowMoreDesc(!showMoreDesc)}
              >
                {showMoreDesc ? "Show less" : "Show more"}
              </span>
            </div>
          </div>

          <hr className="my-4 h-0.5 border-t-0 bg-gray-600 opacity-50" />

          <div className="block max-w p-6 mt-4 bg-slate-900 border border-gray-800 rounded-lg">
            <p className="text-lg">
              Price:{" "}
              <span className="font-bold text-xl">
                {nft.currPrice === 0 ? nft.rawMetadata?.price : nft.currPrice}
              </span>{" "}
              <span className="font-bold">MATIC</span>
            </p>

            {/* <div className="flex justify-between gap-2 text-gray-300">
              <div>
                <span className="text-sm">Fraction price</span>
                <p className="text-lg font-bold">0.1 MATIC</p>
              </div>

              <div>
                <span className="text-sm">Buyout price</span>
                <p className="font-bold">20 MATIC</p>
              </div>

              <div>
                <span className="text-sm">Available fractions</span>
                <p className="text-lg font-bold">1200</p>
              </div>
            </div> */}

            <hr className="my-4 h-0.5 border-t-0 bg-gray-600 opacity-50" />

            {/* <div>
              <form className="flex flex-col md:flex-row gap-4 w-full max-w-lg overflow-hidden">
                <div>
                  <label
                    className="block tracking-wide text-gray-300 text-xs font-bold mb-2"
                    htmlFor="nft-buy-amount"
                  >
                    Amount
                  </label>
                  <input
                    className="w-full appearance-none text-white bg-slate-900  border border-slate-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-slate-800"
                    id="nft-buy-amount"
                    type="number"
                    placeholder="10"
                    step="0.1"
                  />
                </div>

                <div>
                  <label
                    className="block tracking-wide text-gray-300 text-xs font-bold mb-2"
                    htmlFor="nft-you-will-get"
                  >
                    You will get
                  </label>
                  <input
                    className="appearance-none w-full text-white bg-slate-900  border border-slate-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-slate-800"
                    id="nft-you-will-get"
                    type="text"
                    value={"1566"}
                    disabled
                  />
                </div>
              </form>
            </div>

            <hr className="my-4 h-0.5 border-t-0 bg-gray-600 opacity-50" /> */}

            <button
              onClick={handleBuyNFT}
              disabled={isLoadingBuy}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl"
            >
              {isLoadingBuy ? "Running NFT Transfer..." : "Buy Now"}
            </button>
          </div>
        </div>
      </div>

      <hr className="my-12 h-0.5 border-t-0 bg-gray-600 opacity-50 md:opacity-0 md:my-0" />

      {/* Transaction history */}
      <div className="md:p-6 md:px-1 lg:px-8 my-6">
        <div className="relative overflow-x-auto shadow-md rounded-lg">
          <table className="table-auto w-full text-sm text-left text-gray-300 shadow-md">
            <caption className="p-5 text-lg font-semibold text-left text-white bg-slate-900">
              Transaction history
            </caption>
            <thead className="text-xs uppercase bg-gray-600 text-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Tx Hash
                </th>
                <th scope="col" className="px-6 py-3">
                  Block
                </th>
                <th scope="col" className="min-w-[250px] px-6 py-3">
                  Age
                </th>
                <th scope="col" className="px-6 py-3">
                  From
                </th>
                <th scope="col" className="px-6 py-3">
                  To
                </th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((transfer, index) => {
                const { blockNumber, from, to, transactionHash, timestamp } =
                  transfer;
                return (
                  <tr
                    key={index}
                    className="border-b bg-slate-900 border-gray-700 hover:bg-slate-800"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium whitespace-nowrap text-white"
                    >
                      <Link
                        className="text-emerald-500 hover:text-emerald-300"
                        href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}
                        target="_blank"
                      >
                        {formatEndDotsAddr(transactionHash)}
                      </Link>
                    </th>

                    <td className="px-6 py-4">
                      <Link
                        className="text-emerald-500 hover:text-emerald-300"
                        href={`https://mumbai.polygonscan.com/block/${parseInt(
                          blockNumber,
                          "16"
                        )}`}
                        target="_blank"
                      >
                        {parseInt(blockNumber, "16")}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {formatTxDate(timestamp, true)}
                    </td>
                    <td className="min-w-[132px] px-6 py-4">
                      {from.toString().startsWith("0x000000") ? (
                        <p className="inline bg-emerald-600 text-emerald-100 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                          Mint NFT
                        </p>
                      ) : (
                        <Link
                          className="text-emerald-500 hover:text-emerald-300"
                          href={`https://mumbai.polygonscan.com/address/${from}`}
                          target="_blank"
                        >
                          {formatEndDotsAddr(from)}
                        </Link>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        className="text-emerald-500 hover:text-emerald-300"
                        href={`https://mumbai.polygonscan.com/address/${to}`}
                        target="_blank"
                      >
                        {formatEndDotsAddr(to)}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
