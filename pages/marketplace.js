import { useEffect, useRef, useState } from "react";
import { readContracts, useContractRead } from "wagmi";

import {
  abiNFTMarket,
  addressNFTMarket,
} from "../contracts/EmeraldMarketplace";
import { NFTCard } from "../components";
import { formatEther } from "viem";

export default function Marketplace({ ...props }) {
  const ref = useRef(null);
  const [listedNfts, setListedNfts] = useState([]);
  const [nfts, setNfts] = useState({});
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(true);
  const { data, isLoading } = useContractRead({
    address: addressNFTMarket,
    abi: abiNFTMarket,
    functionName: "getAllListing",
  });

  const handleGetNFTs = async (nfts) => {
    setIsLoadingNFTs(true);
    const nftListedMetadata = {};
    let multiCallConfig = [];
    let tokenId, resNft, isOwner, nftDataStorage;

    for (let index = 0; index < nfts.length; index++) {
      tokenId = parseInt(nfts[index].tokenId, 16);
      if (tokenId > 0) {
        resNft = await fetch(`/api/getNftMetadata/${tokenId}`);
        resNft = await resNft.json();

        // get -> curr price
        multiCallConfig.push({
          address: addressNFTMarket,
          abi: abiNFTMarket,
          functionName: "getListing",
          args: [tokenId],
        });

        if (props.isConnect) {
          isOwner = await verifyNftOwnership(tokenId);
          if (!isOwner) nftListedMetadata[tokenId] = resNft;
        } else {
          nftListedMetadata[tokenId] = resNft;
        }
      }
    }

    nftDataStorage = await readContracts({ contracts: multiCallConfig });
    for (let index = 0; index < nftDataStorage.length; index++) {
      const { status, result } = nftDataStorage[index];
      if (status === "success") {
        tokenId = parseInt(result.tokenId);
        if (nftListedMetadata[tokenId]) {
          nftListedMetadata[tokenId]["currPrice"] = formatEther(result.price);
        }
      }
    }

    setNfts(nftListedMetadata);
    setIsLoadingNFTs(false);
  };

  const verifyNftOwnership = async (tokenId) => {
    // let isOwnerShip = await fetch(
    //   `/api/verifyNftOwnership/${props.connectUser}`
    // );
    // return isOwnerShip.json();
    let mainOwner = await fetch(`/api/getOwnersForNft/${tokenId}`);
    mainOwner = await mainOwner.json();
    mainOwner = mainOwner.owners[0];

    return (
      String(mainOwner).toLowerCase() ===
      String(props.connectUser).toLowerCase()
    );
  };

  useEffect(() => {
    if (data?.length > 0) {
      setIsLoadingNFTs(true);
      setListedNfts(data);
    } else {
      setIsLoadingNFTs(false);
    }
  }, [data]);

  useEffect(() => {
    if (listedNfts.length > 0) handleGetNFTs(listedNfts);
  }, [listedNfts]);

  return (
    <div className="max-w-[1280px] w-full p-6 lg:px-8 overflow-y-auto overflow-x-hidden h-full">
      {Boolean(isLoading || isLoadingNFTs) && (
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

      <div className="flex flex-wrap gap-8 justify-center">
        {Boolean(
          Object.keys(nfts).length === 0 && !isLoading && !isLoadingNFTs
        ) && (
          <h5 className="text-red-400 text-3xl font-bold text-center">
            No NFTs listed in the marketplace yet.
          </h5>
        )}

        {Object.keys(nfts).length > 0 &&
          Object.keys(nfts).map((tokenId) => {
            const nft = nfts[tokenId];
            const { rawMetadata, currPrice } = nft;
            return (
              <NFTCard
                title={rawMetadata?.name}
                image={rawMetadata?.image || "/gem-default.png"}
                price={currPrice}
                slug={tokenId}
                key={tokenId}
              />
            );
          })}
      </div>
    </div>
  );
}
