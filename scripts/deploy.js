const hre = require("hardhat");
const {ethers, artifacts} = require("hardhat");

async function main() {
  
  const EventNFT = await ethers.getContractFactory("EventNFT");
  const EventSeller = await ethers.getContractFactory("EventSeller");

  const eventSeller = await EventSeller.deploy();
  await eventSeller.deployed();

  const eventNFT = await EventNFT.deploy(eventSeller.address);
  await eventNFT.deployed();

  await eventSeller.setEventContract(eventNFT.address);


  console.log("EventNFT Contract deployed to:", eventNFT.address);
  console.log("EventSeller Contract deployed to:", eventSeller.address);
  // const eventId = await eventContract.createEvent(ethers.BigNumber.from("0.001"), 25, "https://jsonkeeper.com/b/T0EW");

  // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
  saveFrontendFiles(eventNFT, "EventNFT");
  saveFrontendFiles(eventSeller, "EventSeller");

}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/components/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
