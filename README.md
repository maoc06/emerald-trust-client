# Emerald Trust :green_book:

## Table of contents

- [General info](#general-info)
- [Technologies](#technologies)
- [Setup](#setup)
- [Features](#features)
- [ToDo](#to-do)

## General info

This is the complement (UI interaction) to the final project of the [Ethereum Developer Bootcamp at Alchemy University](https://github.com/maoc06/Emerald-trust-hh). The project consists of an open and secure marketplace that lists and records emerald transactions in the form of NFTs 📝📦🔗📦

The motivation is not only the consolidation of the knowledge acquired in the Bootcamp, but also that I am Colombian, a country that extracts and produces the largest amount of emeralds 🟢 for the world market 🌎 as well as the most sought after ✨, **however it does not have a decentralized, secure and fast market for retail.**

## Technologies

Project is created with:

- Next.js: 13.4.1
- Alchemy SDK: 2.8.3
- WalletConnect: 2.x.x
- Wagmi: 1.0.4

## Setup

#### Install dependencies

To run this project, first install it locally:

```bash
npm install
# or
yarn install
```

#### Set environment variables

It is necessary to configure the environment variables. To do this, follow these steps:

```bash
touch .env.local
```

open the .env.local file and set the following format:

```bash
ALCHEMY_API_KEY=<<alchemy_api_key>>
CONTRACT_NFT_ADDR=<<token_smart_contract_address>>
CONTRACT_MARKET_ADDR=<<marketplace_smart_contract_address>>
IPFS_API_KEY=<<ipfs_service_api_key>>
IPFS_SECRET=<<ipfs_service_secret>>
WALLET_CONNECT_PROJECT_ID=<<wallet_connect_project_id>>
PINATA_GATEWAY=<<ipfs_service_provider_inbound_address>>
PINATA_HOSTNAME=<<ipfs_provider_service_dns_address_base_path>>

```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Mining emerald NFTs.
- Can be approved so that the marketplace can list and transfer them.
- The listing can be cancelled in the marketplace.
- Buy an emerald NFT.
- Update the selling price.
- You can view the transaction history of a specific token.
- You can withdraw the proceeds from sales.
- You can view the profit history.

## To Do

- Enable auctions for NFTs.
- Withdrawal history.
- Improve the navigation map.
- NFTs search engine.
- Share on different social networks the page of an NFT.
- Create sales statistics.
- In general, improve the user experience.
- Allow fractional purchases (in consideration).
