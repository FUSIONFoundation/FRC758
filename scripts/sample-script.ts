// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile');
  const [owner, other] = await hre.ethers.getSigners();
  // We get the contract to deploy
  const ExampleToken = await hre.ethers.getContractFactory("ExampleToken");
  const exampleToken = await ExampleToken.deploy("Hello", "Hello", 18);

  await exampleToken.deployed();

  console.log("ExampleToken deployed to:", exampleToken.address);

  const _maxTime = await exampleToken.MAX_TIME()

  const maxTime = parseInt(_maxTime._hex)

  const now = parseInt( (Date.now() / 1000).toString())

  const amount = 190000000000000
  
  await exampleToken.mint(owner.address, amount, now, maxTime);

  const _balance0 = await exampleToken.balanceOf(owner.address, now, maxTime);
  const balance0 = parseInt(_balance0._hex)
  if(amount != balance0) {
    console.log('错误:', amount, balance0)
  }
  console.log(balance0)


  await exampleToken.safeTransferFrom(owner.address, other.address, 1000, now, maxTime)
  const _balance2 = await exampleToken.balanceOf(owner.address, now, maxTime)
  const balance2 = parseInt(_balance2._hex)
  if(amount != balance2) {
    console.log('错误:', amount, balance2)
  }
  
  console.log(balance2)

  // await exampleToken.burn(owner.address, amount, now, maxTime);
  // const _balance1 = await exampleToken.balanceOfFor(owner.address)

  // const balance1 = parseInt(_balance1._hex)
  // if(0 != balance1) {
  //   console.log('错误:', amount, balance1)
  // }
  // console.log(balance1)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
