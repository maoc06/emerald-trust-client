/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    alchemyApiKey: process.env.ALCHEMY_API_KEY,
    contractNftAddr: process.env.CONTRACT_NFT_ADDR,
    contarctMarketAddr: process.env.CONTRACT_MARKET_ADDR,
    ipfsApiKey: process.env.IPFS_API_KEY,
    ipfsSecret: process.env.IPFS_SECRET,
    walletConnectProjectId: process.env.WALLET_CONNECT_PROJECT_ID,
    pinataGateway: process.env.PINATA_GATEWAY,
    pinataHostname: process.env.PINATA_HOSTNAME,
  },
  images: {
    domains: ["brown-tender-rat-652.mypinata.cloud"],
  },
};

module.exports = nextConfig;
