const hre = require("hardhat");
const {ethers} = require("hardhat");

async function main() {
  
  const Events = await hre.ethers.getContractFactory("Events");
  const eventContract = await Events.deploy();
  await eventContract.deployed();

  console.log("Events Contract deployed to:", eventContract.address);
  const eventId = await eventContract.createEvent(ethers.utils.parseEther("0.001"), 25, "https://jsonkeeper.com/b/T0EW");
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
