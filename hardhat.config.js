require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require("@nomiclabs/hardhat-etherscan");

const [rinkebyUrl, PrivateKey, EtherscanApiKey] = [process.env.RinkebyURL, process.env.PrivateKey, process.env.EtherscanApiKey];



module.exports = {
  solidity: "0.8.10",
  defaultNetwork: "hardhat",
  networks: {
    rinkeby: {
      url: rinkebyUrl,
      accounts: [PrivateKey],
    }},
    etherscan: {
      // Your API key for Etherscan
      // Obtain one at https://etherscan.io/
      apiKey: EtherscanApiKey
    }
};
