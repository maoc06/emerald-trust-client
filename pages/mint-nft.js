import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractEvent,
} from "wagmi";

import {
  abiNFT,
  abiNFTMarket,
  addressNFT,
  addressNFTMarket,
} from "../contracts";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../utils/ipfs";
import { useDebounce } from "../hooks/useDebounce";

export default function MintNft() {
  const ref = useRef(null);
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const [showMintOverlay, setShowMintOverlay] = useState(false);
  const [showSuccessMintOverlay, setShowSuccessMintOverlay] = useState(false);
  // const [showApproveMsg, setShowApproveMsg] = useState(false);
  const [isTokenMined, setIsTokenMined] = useState(false);

  const [formParams, updateFormParams] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [file, setFile] = useState();
  const [nftMetadataURL, setNftMetadataURL] = useState("none");
  const [mintTokenId, setMintTokenId] = useState("");
  const [txHash, setTxHash] = useState("");

  const debouncedMetadata = useDebounce(nftMetadataURL, 500);
  const debouncedMintTokenId = useDebounce(mintTokenId, 500);
  const debouncedTxHash = useDebounce(txHash, 500);

  // APPROVE TO LIST PREPARE WRITE
  // const { config: configApproveToList, isError: isErrorApprove } =
  //   usePrepareContractWrite({
  //     address: addressNFT,
  //     abi: abiNFT,
  //     functionName: "approve",
  //     args: [addressNFTMarket, debouncedMintTokenId],
  //     enabled: Boolean(debouncedMintTokenId),
  //   });
  // const { write: approveNFT, data: approveTx } =
  //   useContractWrite(configApproveToList);
  // const { isSuccess: isSuccessApprove } = useWaitForTransaction({
  //   hash: approveTx?.hash,
  // });

  // MINT NFT PREPARE WRITE
  const { config, isError: isErrorMint } = usePrepareContractWrite({
    address: addressNFT,
    abi: abiNFT,
    functionName: "mintNft",
    args: [address, debouncedMetadata],
    enabled: Boolean(debouncedMetadata),
  });
  const { write: mintEmeraldNft, data: emeraldNft } = useContractWrite(config);
  const { isLoading: isLoadingMint, isSuccess: isSuccessMint } =
    useWaitForTransaction({
      hash: emeraldNft?.hash,
    });

  // UPDATE TX HASH
  const { config: configTxHash, isError: isErrorTxHash } =
    usePrepareContractWrite({
      address: addressNFTMarket,
      abi: abiNFTMarket,
      functionName: "updateMintHash",
      args: [addressNFT, debouncedMintTokenId, debouncedTxHash],
      enabled: Boolean(debouncedMintTokenId && debouncedTxHash),
    });
  const { write: updateMintHash, data: updatedTxHash } =
    useContractWrite(configTxHash);
  const { isSuccess: isSuccessUpdateHash } = useWaitForTransaction({
    hash: updatedTxHash?.hash,
  });

  // MINT TRANSFER EVENT LISTENER (approve to list)
  useContractEvent({
    address: addressNFT,
    abi: abiNFT,
    eventName: "Transfer",
    listener(data) {
      const tokenId = parseInt(data[0].topics[3], 16);
      setMintTokenId(tokenId);
    },
  });

  const uploadMetadataToIPFS = async (imageIpfsUrl) => {
    const { name, description, price } = formParams;

    if (!name || !description || !price || !imageIpfsUrl || !address) return;

    const nftJSON = {
      name,
      description,
      price,
      image: imageIpfsUrl,
      minedBy: address,
    };

    try {
      const resJsonIpfs = await uploadJSONToIPFS(nftJSON);
      if (resJsonIpfs.success) {
        // console.log(`Uploading NFT metdata to IPFS ${resJsonIpfs.pinataURL}`);
        setNftMetadataURL(resJsonIpfs.pinataURL);
        return resJsonIpfs.pinataURL;
      }
    } catch (error) {
      // console.error("Error uploading JSON metadata");
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    try {
      const resFileIPFS = await uploadFileToIPFS(file);
      if (resFileIPFS.success) {
        return resFileIPFS.pinataURL;
      }
    } catch (error) {
      // console.error("Unable to upload NFT Emerald image to IPFS", error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const mintNft = async (e) => {
    // console.log("Minting Emerald NFT...");
    e.preventDefault();
    setShowMintOverlay(true);

    try {
      const imageIpfsUrl = await uploadFile(); // first, upload NFT Image to IPFS
      await uploadMetadataToIPFS(imageIpfsUrl); // second, upload NFT Metadata to IPFS (include image)
      // then, execute useEffect when NFT Metadata URL set...and reset values
      updateFormParams({ name: "", description: "", price: "" });
    } catch (error) {
      setShowMintOverlay(false);
      // console.error("Unable to mining NFT Emerald");
    }
  };

  useEffect(() => {
    if (
      debouncedMetadata !== "none" &&
      !isErrorMint &&
      typeof mintEmeraldNft === "function"
    ) {
      const metadataURL = new URL(debouncedMetadata);
      if (metadataURL.hostname === process.env.pinataHostname) {
        mintEmeraldNft(); // finally, mint NFT with generated metadata
        setIsTokenMined(true);
      }
    }
  }, [isErrorMint, debouncedMetadata, mintEmeraldNft]);

  // useEffect(() => {
  //   if (
  //     debouncedMintTokenId &&
  //     !isErrorApprove &&
  //     typeof approveNFT === "function"
  //   ) {
  //     setShowApproveMsg(true);
  //     approveNFT();
  //     setIsTokenMined(true);
  //   }
  // }, [isErrorApprove, debouncedMintTokenId, approveNFT]);

  useEffect(() => {
    if (isSuccessMint && isSuccessUpdateHash) {
      setShowMintOverlay(false);
      setShowSuccessMintOverlay(true);
    }
  }, [isSuccessMint, isSuccessUpdateHash]);

  useEffect(() => {
    if (emeraldNft?.hash && debouncedMintTokenId) {
      setTxHash(emeraldNft.hash);
      // console.log("1. HASH:", emeraldNft.hash);
    }
  }, [emeraldNft, debouncedMintTokenId]);

  useEffect(() => {
    if (
      isTokenMined &&
      !isErrorTxHash &&
      debouncedTxHash &&
      debouncedMintTokenId &&
      typeof updateMintHash === "function"
    ) {
      updateMintHash();
      // console.log("2. HASH:", debouncedTxHash);
    }
  }, [isTokenMined, debouncedTxHash, debouncedMintTokenId, updateMintHash]);

  return (
    <div className="w-full flex justify-center items-center max-w-[1280px]">
      {showMintOverlay && (
        <div className="px-10 fixed top-0 left-0 text-white text-center text-xl font-bold flex flex-col justify-center items-center inset-0 z-50 h-full w-full bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-25">
          <lottie-player
            id="mintLottie"
            ref={ref}
            autoplay
            loop
            mode="normal"
            src="/animations/emerald.json"
            style={{ width: "300px", height: "300px" }}
          ></lottie-player>

          <p>
            Please wait, we are mining your Emerald NFT...<br></br>Accept
            transaction in your wallet.
          </p>

          {/* {!showApproveMsg && (
            <p>
              Please wait, we are mining your Emerald NFT...<br></br>Accept
              transaction in your wallet.
            </p>
          )} */}

          {/* {showApproveMsg && (
            <p>
              Now, please approve your listing in the Emerald Trust marketplace
              <br></br>
              and wait a few seconds please for confirmation.
            </p>
          )} */}
        </div>
      )}

      {showSuccessMintOverlay && (
        <div className="fixed top-0 left-0 flex flex-col md:flex-row justify-center items-center inset-0 z-50 h-full w-full bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-25 text-white text-xl bg-slate-950">
          <div className="flex flex-col justify-center items-center">
            <lottie-player
              id="successMint"
              ref={ref}
              autoplay
              count={1}
              src="/animations/success.json"
              style={{ width: "500px", height: "500px" }}
            ></lottie-player>

            <div className="px-20 relative -top-36 flex flex-col justify-center items-center">
              <p className="text-center">
                Your Emerald NFT was successfully mined
              </p>

              <div className="mt-2 flex flex-col md:flex-row">
                <button
                  onClick={() => {
                    router.push("/my-nfts");
                  }}
                  className="my-4 md:mb-0 inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl md:mr-3 cursor-pointer"
                >
                  See my NFTs
                </button>

                <Link
                  href={`https://mumbai.polygonscan.com/tx/${emeraldNft?.hash}`}
                  target="_blank"
                  className="inline-flex items-center justify-center px-5 py-3 md:mt-4 text-base font-medium text-center border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-slate-800 focus:ring-4 focus:ring-gray-100 text-white cursor-pointer"
                >
                  Check out in Polygonscan
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex flex-col lg:justify-center items-center md:p-6 lg:px-8 overflow-auto bg-slate-800">
        <h5 className="text-white mb-6 text-3xl font-bold tracking-tight capitalize">
          Mine Your Emerald NFT
        </h5>

        <div className="w-full flex flex-col justify-between p-6 bg-slate-900 border border-gray-800 rounded-lg">
          <form className="flex flex-col" onSubmit={mintNft}>
            <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-6 w-full h-full">
              <div className="flex-1">
                <div className="w-full lg:px-3 mb-6">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-nft-name"
                  >
                    NFT Name
                  </label>
                  <input
                    className="appearance-none block w-full bg-slate-900 text-white border border-slate-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-slate-800"
                    id="grid-nft-name"
                    type="text"
                    placeholder="Emerald NFT Name"
                    onChange={(e) =>
                      updateFormParams({ ...formParams, name: e.target.value })
                    }
                  />
                </div>

                <div className="w-full lg:px-3 mb-6">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-description"
                  >
                    Emerald description
                  </label>
                  <input
                    className="appearance-none block w-full text-white bg-slate-900  border border-slate-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-slate-800 focus:border-gray-500"
                    id="grid-description"
                    type="text"
                    placeholder="Describe your emerald in detail"
                    onChange={(e) =>
                      updateFormParams({
                        ...formParams,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-wrap">
                  <div className="w-full lg:px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-nft-price"
                    >
                      Price (in MATIC)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min={"0.01"}
                      className="appearance-none block text-white w-full bg-slate-900 border border-slate-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-slate-800 focus:border-gray-500"
                      id="grid-nft-price"
                      placeholder="Min 0.01 MATIC"
                      onChange={(e) =>
                        updateFormParams({
                          ...formParams,
                          price: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap flex-1">
                <div className="flex justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 bg-slate-800 border-slate-600 border-dashed rounded-lg cursor-pointer  hover:bg-slate-700"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        aria-hidden="true"
                        className="w-10 h-10 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      {file ? (
                        <p className="text-gray-500">{file.name}</p>
                      ) : (
                        <div>
                          <p className="mb-2 text-sm text-gray-500 text-center">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 text-center">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            <button
              disabled={!mintEmeraldNft || !isConnected || isLoadingMint}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl mt-6 md:mt-4"
            >
              {isLoadingMint ? "Minting Emerald NFT..." : "Mint Emerald NFT"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
