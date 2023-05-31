import { useEffect, useState } from "react";
import { Dialog, Popover } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Web3Button } from "@web3modal/react";
import Link from "next/link";
import Image from "next/image";

export default function Header({ isConnect = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-800">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Emerald Trust</span>

            <Image
              className="w-full"
              src="/logo.png"
              width={38}
              height={38}
              alt="logo emerald trust"
            />
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <Link
            href="/explore-us"
            className="text-sm font-semibold leading-6 text-white"
          >
            Explore
          </Link>

          <Link
            href="/marketplace"
            className="text-sm font-semibold leading-6 text-white"
          >
            Marketplace
          </Link>

          <Link
            href="/mint-nft"
            className="text-sm font-semibold leading-6 text-white"
          >
            Mint NFT
          </Link>

          {isConnect && (
            <Link
              href="/my-nfts"
              className="text-sm font-semibold leading-6 text-white"
            >
              Manage My NFTs
            </Link>
          )}

          {isConnect && (
            <Link
              href="/proceed"
              className="text-sm font-semibold leading-6 text-white"
            >
              Withdraw
            </Link>
          )}
        </Popover.Group>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Web3Button />
        </div>
      </nav>

      {/* MOBILE */}
      <Dialog
        as="div"
        className="lg:hidden "
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10 " />
        <Dialog.Panel className="bg-slate-800 fixed inset-y-0 right-0 z-50 w-full overflow-y-auto  px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Emerald Trust</span>
              <Image
                className="w-full"
                src="/logo.png"
                width={20}
                height={20}
                alt="logo emerald trust"
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-slate-400">
              <div className="space-y-2 py-6">
                <Link
                  href="/explore-us"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-slate-900"
                >
                  Explore
                </Link>

                <Link
                  onClick={() => setMobileMenuOpen(false)}
                  href="/marketplace"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-slate-900"
                >
                  Marketplace
                </Link>

                <Link
                  onClick={() => setMobileMenuOpen(false)}
                  href="/mint-nft"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-slate-900"
                >
                  Mint My NFT
                </Link>

                {isConnect && (
                  <Link
                    onClick={() => setMobileMenuOpen(false)}
                    href="/my-nfts"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-slate-900"
                  >
                    Manage My NFTs
                  </Link>
                )}

                {isConnect && (
                  <Link
                    onClick={() => setMobileMenuOpen(false)}
                    href="/proceed"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-slate-900"
                  >
                    Withdraw
                  </Link>
                )}
              </div>

              <div className="py-6">
                <Web3Button />
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
