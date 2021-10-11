
# Marketplace
this project contains the implementation of an online decentralized marketplace written in Solidity.

## Users Story
In this project users can Add a product to marketplace or Buy a product that has been already defined in the smart contract


### Running the Project

##### Requirements
For running this project locally you'll need to have these applications installed

 - Truffle (`npm i -g truffle`)
 - Local Blockchain ( Like Ganache: `npm i -g ganache-cli` )
 - MetaMask 

###### Deploy Smart Contract
 - `cd smartcontract`
 - `npm install`
 - modify your local blockchain in `smartcontract/truffle-config.js`
 - `truffle deploy`

###### Run client side
development mode
 - `cd client`
 - `yarn install`
 - `yarn start`

production mode
 - `cd client`
 - `yarn install`
 - `yarn build`
 - `npm i -g serve`
 - `serve -s build`