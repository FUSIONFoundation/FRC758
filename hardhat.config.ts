import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "fsn",
  networks: {
    fsn: {
      url: "http://47.242.22.229:8645",
      // url: 'https://mainnet.anyswap.exchange',
      accounts: ['4d53bcdfc5312a3de2e6a15b2112d307edc2366bf8f76b61b715d3fb51b510f7']
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/7a8e2740cdfa4b72b24e114b531ada42",
      accounts: ['4d53bcdfc5312a3de2e6a15b2112d307edc2366bf8f76b61b715d3fb51b510f7']
    }
  },
  solidity: {
    compilers:[
      {    
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999
          },
          // evmVersion: "istanbul",
          evmVersion: "byzantium",
          outputSelection: {
            "*": {
              "*": [
                "evm.bytecode.object",
                "evm.deployedBytecode.object",
                "abi",
                "evm.bytecode.sourceMap",
                "evm.deployedBytecode.sourceMap",
                "metadata"
              ],
              "": ["ast"]
            }
          }
        } 
      }
    ]
  }
};

