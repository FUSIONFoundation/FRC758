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

  const exampleToken = await hre.ethers.getContractAt("ChaingeToken", '0x0355B7B8cb128fA5692729Ab3AAa199C1753f726', owner);
  
  let now = parseInt( (Date.now() / 1000).toString())

  console.log("ChaingeToken deployed to:", exampleToken.address);

  
  await exampleToken.setApprovalForAll('0x172076E0166D1F9Cc711C77Adf8488051744980C', true);


  await exampleToken.isApprovedForAll('0x172076E0166D1F9Cc711C77Adf8488051744980C', );
  // const _maxTime = await exampleToken.MAX_TIME()

  // const maxTime = parseInt(_maxTime._hex).toString()

  // console.log(maxTime);

  // await sleep()

  // const balance1 = await exampleToken.timeBalanceOf(owner.address, now+50, now + 100);
  // console.log('bef', parseInt(balance1._hex));
  // await sleep()

  // await exampleToken.timeSliceTransferFrom(owner.address, "0xcd3b766ccdd6ae721141f452c550ca635964ce71", 1000, now, now + 100)
  // const balance2 = await exampleToken.timeBalanceOf(owner.address, now+50, now + 100);
  // console.log('aft', parseInt(balance2._hex));

  // const balance3 = await exampleToken.timeBalanceOf(owner.address, now+100, now + 200);
  // console.log('100-200', parseInt(balance3._hex));


  // const balance4 = await exampleToken.timeBalanceOf(owner.address, now, now + 50);
  // console.log('0-50', parseInt(balance4._hex));


  // const balance5 = await exampleToken.timeBalanceOf(owner.address, now, now + 100);
  // console.log('0-100', parseInt(balance5._hex));

  // const balance6 = await exampleToken.timeBalanceOf(owner.address, now + 50, now + 100);
  // console.log('50-100', parseInt(balance6._hex));

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

  

  async function sleep() {
    return new Promise(function(resv) {
        setTimeout(() => {
          resv()
        }, 15000)
    })
  }
  