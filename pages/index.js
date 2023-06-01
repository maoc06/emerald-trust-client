import Link from "next/link";
import {
  ShieldCheckIcon,
  UsersIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

export default function Home({ ...props }) {
  return (
    <div>
      {/* HERO SECTION */}
      <section className="bg-slate-800 z-20">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <Image
            width={1500}
            height={1500}
            src="/hero-home-mobile.png"
            className="block md:hidden absolute inset-0 h-screen w-full object-cover"
          />

          <Image
            width={1500}
            height={1500}
            src="/hero-home.png"
            className="hidden md:block absolute inset-0 h-screen w-full object-cover"
          />

          <div className="mr-auto place-self-center lg:col-span-7 z-10">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-white">
              Buy and Sell Emeralds With Confidence
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-300 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              Welcome to the leading marketplace for buying and selling NFTs
              representing exquisite emeralds. The beauty of these precious
              stones meets the power of blockchain technology.
            </p>

            <button
              onClick={props.openWeb3Modal}
              className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl mr-3 cursor-pointer"
            >
              Get started{" "}
              <svg
                className="w-5 h-5 ml-2 -mr-1"
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
            </button>

            <Link
              href="/explore-us"
              className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-slate-800 focus:ring-4 focus:ring-gray-100 text-white cursor-pointer"
            >
              Explore Us
            </Link>
          </div>
          {/* <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <Image width={520} height={390} src="/hero-home.png" alt="mockup" />
          </div> */}
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="bg-slate-800  my-8">
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <div className="max-w-screen-md mb-8 lg:mb-16">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-white">
              Designed to build confidence
            </h2>
            <p className="sm:text-xl text-gray-400">
              Our mission is to provide a secure and transparent marketplace
              that bridges the gap between traditional gemstone trading and the
              cutting-edge potential of NFTs.
            </p>
          </div>
          <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
            <div>
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 bg-primary-900">
                <ShieldCheckIcon className="text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Security</h3>
              <p className="text-gray-400">
                Through blockchain technology, we offer immutable ownership
                records and a seamless trading experience, allowing you to buy
                and sell emerald NFTs with utmost confidence.
              </p>
            </div>
            <div>
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 bg-primary-900">
                <RocketLaunchIcon className="text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">
                Seamless and Fast
              </h3>
              <p className="text-gray-400">
                Seamlessly and swiftly acquire trusted emeralds, while securely
                transferring ownership, revolutionizing the traditional market.
              </p>
            </div>
            <div>
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 bg-primary-900">
                <UsersIcon className="text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">
                Democratization
              </h3>
              <p className="text-gray-400">
                Whether you collect, invest, or admire emeralds, our platform
                offers a secure space to explore, acquire, and trade these
                unique digital representations of Earth&#39;s coveted treasures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROFF SECTION */}
      {/* <section className="bg-slate-800 my-8">
        <div className="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-16 lg:px-6">
          <dl className="grid max-w-screen-md gap-8 mx-auto sm:grid-cols-3 text-white">
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-3xl md:text-4xl font-extrabold">73M+</dt>
              <dd className="font-light text-gray-400">developers</dd>
            </div>
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-3xl md:text-4xl font-extrabold">1B+</dt>
              <dd className="font-light text-gray-400">contributors</dd>
            </div>
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-3xl md:text-4xl font-extrabold">4M+</dt>
              <dd className="font-light text-gray-400">organizations</dd>
            </div>
          </dl>
        </div>
      </section> */}

      {/* CTA SECTION */}
      <section className=" bg-slate-800">
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold leading-tight text-white">
              Discover Emerald NFTs Now!
            </h2>

            <p className="mb-6 font-light text-gray-400 md:text-lg">
              ¡Experience the Excitement of Emerald NFTs! No credit card
              required.
            </p>

            <button
              onClick={props.openWeb3Modal}
              className="w-64 items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 mr-2 mb-2 rounded-xl"
            >
              Get started
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
