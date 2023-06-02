import Image from "next/image";

export default function ExploreUs({ ...props }) {
  return (
    <div className="max-w-[1280px] w-full p-6 lg:px-8 overflow-auto h-full">
      <section>
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-white">
            Explore the World of Emerald Trust!
          </h1>
          <p className="mb-8 text-lg font-normal lg:text-xl sm:px-16 xl:px-48 text-gray-400">
            We provide a revolutionary platform for retail trading of
            blockchain-backed NFTs showcasing the beauty and rarity of emeralds.
            Through blockchain technology, we ensure authenticity, transparency,
            and security in every transaction
          </p>
        </div>
      </section>

      <section>
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="max-w-screen-lg sm:text-lg text-gray-400">
            <h2 className="mb-4 text-4xl tracking-tight font-bold text-white">
              Enhanced Transparency
            </h2>
            <p className="mb-4 font-light">
              Blockchain ensures transparent and immutable records of ownership,
              enabling the traceability and provenance of each emerald NFT. With
              this technology, we establish a trustworthy system that guarantees
              the authenticity and origin of the emeralds, fostering a secure
              marketplace for these unique digital assets.
            </p>
            <p className="mb-4 font-medium">
              Our commitment to utilizing blockchain technology ensures that
              every transaction involving emerald NFTs is seamlessly recorded,
              providing an unbroken chain of ownership and enhancing the overall
              integrity of the marketplace.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
          <div className="font-light sm:text-lg text-gray-400">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-white">
              Secure Transactions
            </h2>
            <p className="mb-4">
              The decentralized nature of blockchain ensures secure and
              tamper-proof transactions, benefiting both buyers and sellers. By
              eliminating the need for intermediaries and central authorities,
              blockchain provides a trusted environment where transactions are
              protected from unauthorized access or manipulation. This enhances
              the overall security of the retail trade of emeralds, giving
              confidence to all parties involved.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Image
              width={300}
              height={450}
              className="w-full rounded-lg"
              src="/explore-0.jpg"
              alt="emerald build"
            />
            <Image
              width={300}
              height={450}
              className="mt-4 w-full lg:mt-10 rounded-lg"
              src="/explore-1.png"
              alt="office content 2"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="max-w-screen-lg sm:text-lg text-gray-400">
            <h2 className="mb-4 text-4xl tracking-tight font-bold text-white">
              Global And Efficient
            </h2>
            <p className="mb-4 font-light">
              Through the implementation of smart contracts, we streamline the
              buying and selling process, reducing intermediaries and
              facilitating faster, more efficient transactions. By automating
              key aspects of the trading process, we enhance convenience and
              minimize delays, ensuring a seamless experience for our users. Our
              platform empowers efficient and frictionless trading,
              revolutionizing the retail landscape for emerald enthusiasts.
            </p>
            <p className="mb-4 font-medium">
              Utilizing blockchain-based NFTs, we enable collectors worldwide to
              discover and acquire unique emerald NFTs, fostering global
              participation. Our platform breaks geographical barriers,
              connecting collectors from all corners of the globe to the
              captivating world of emerald NFTs.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
          <Image
            width={1000}
            height={1000}
            className="w-full block"
            src="/explore-2.png"
            alt="join to emerald trust community"
          />
          <div className="mt-4 md:mt-0">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-white">
              Be part of the global movement in the emerald retail industry.
            </h2>
            <p className="mb-6 font-light md:text-lg text-gray-400">
              With our innovative platform, you can discover, buy, and sell
              high-quality emeralds, backed by blockchain technology that
              ensures authenticity, transparency, and trust in every
              transaction.
            </p>
            <div
              onClick={props.openWeb3Modal}
              className="cursor-pointer inline-flex items-center text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Get started
              <svg
                className="ml-2 -mr-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
