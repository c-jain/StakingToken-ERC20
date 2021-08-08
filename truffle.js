require('dotenv').config();

const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = process.env["MNEMONIC"];
const ropstenKey = process.env["ROPSTEN_KEY"];

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      host: "localhost",
      provider: () => new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/" + ropstenKey),
			network_id: 3,
			gas: 7000000,
			gasPrice: 100000000000,
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200  // Optimize for how many times you intend to run the code
        },
      }
    }
  }
};
