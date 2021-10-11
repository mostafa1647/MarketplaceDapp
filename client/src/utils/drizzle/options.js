import Web3 from "web3";
import Marketplace from "../contracts/Marketplace.json";


const options = {
	web3: {
		block: false,
		// customProvider: new Web3("ws://localhost:8545"),
	},
	contracts: [Marketplace],
	events: {
		LogForSale: ["LogForSale"],
		LogSold: ["LogSold"],
		ProductAdded: ["ProductAdded"],
		ProductModified: ["ProductModified"],
		ProductRemoved: ["ProductRemoved"],
	},
};

export default options;