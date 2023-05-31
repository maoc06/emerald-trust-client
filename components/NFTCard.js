import Link from "next/link";
import Image from "next/image";

// import ethIcon from "../public/Ethereum.svg";
import maticIcon from "../public/Polygon-MATIC-Icon.svg";

export default function NFTCard({
  title = "default title",
  image,
  price = "0.0",
  slug,
}) {
  return (
    <Link className="min-w-[316px]" href={`/emerald-nft/${slug}`}>
      <div className="max-w-xs max-h-96 overflow-hidden border rounded-2xl shadow bg-slate-900 border-gray-800 cursor-pointer transform transition duration-300 hover:scale-105">
        <div className="relative w-full h-64 max-h-64 bg-gray-700 rounded-t-xl overflow-hidden">
          <Image
            className="w-full object-cover"
            src={image}
            alt={`Picture of ${title}`}
            fill={true}
          />
        </div>

        <div className="px-6 py-4">
          <h5 className="text-white mb-2 text-base tracking-tight capitalize truncate">
            {title}
          </h5>

          <div className="flex justify-between items-center">
            <div className="flex mr-8">
              <Image src={maticIcon} width={32} height={32} alt={`Ethereum`} />
              <p className="text-white text-xl font-bold">
                {/* <span className="font-bold">Price: </span> */}
                {price} <span className="text-sm">MATIC</span>
              </p>
            </div>

            <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
