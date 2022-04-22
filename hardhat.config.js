require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

const [rinkebyUrl, PrivateKey] = [process.env.RinkebyURL, process.env.PrivateKey];



module.exports = {
  solidity: "0.8.10",
  defaultNetwork: "hardhat",
  networks: {
    rinkeby: {
      url: rinkebyUrl,
      accounts: [PrivateKey],
    }},
};
