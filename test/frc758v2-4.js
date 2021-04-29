const { expect } = require("chai");

describe("FRC758", function () {

  // ————————————mintTimeSlice 4 frames———————————— 
  // it("0-10 10-15 15-20 20-25", async function () {
  //   const [owner, other] = await ethers.getSigners();
  //   const FRC758 = await ethers.getContractFactory("ChaingeToken");
  //   const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);
  //   await frc758.deployed();
  //   const now = Date.parse(new Date()) / 1000;
  //   const amount1 = 10;
  //   const amount2 = 20;
  //   const amount3 = 30;
  //   const amount4 = 40;
  //   await frc758.mintTimeSlice(owner.address, amount1, now, now + 10);
  //   await frc758.mintTimeSlice(owner.address, amount2, now + 10, now + 15);
  //   await frc758.mintTimeSlice(owner.address, amount3, now + 15, now + 20);
  //   await frc758.mintTimeSlice(owner.address, amount4, now + 20, now + 25);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 10)).to.equal(10);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 15)).to.equal(10);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 20)).to.equal(10);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 25)).to.equal(10);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 15)).to.equal(20);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 20)).to.equal(20);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 25)).to.equal(20);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 20)).to.equal(30);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 25)).to.equal(30);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 20, now + 25)).to.equal(40);
  // });

  // it("0-10 12-15 17-20 19-25", async function () {
  //   const [owner, other] = await ethers.getSigners();
  //   const FRC758 = await ethers.getContractFactory("ChaingeToken");
  //   const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);
  //   await frc758.deployed();
  //   const now = Date.parse(new Date()) / 1000;
  //   const amount1 = 10;
  //   const amount2 = 20;
  //   const amount3 = 30;
  //   const amount4 = 40;
  //   await frc758.mintTimeSlice(owner.address, amount1, now, now + 10);
  //   await frc758.mintTimeSlice(owner.address, amount2, now + 12, now + 15);
  //   await frc758.mintTimeSlice(owner.address, amount3, now + 17, now + 20);
  //   await frc758.mintTimeSlice(owner.address, amount4, now + 19, now + 25);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 10)).to.equal(10);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 12)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 15)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 17)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 19)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 20)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 25)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 15)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 17)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 19)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 20)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 25)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 15)).to.equal(20);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 17)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 19)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 20)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 25)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 17)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 19)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 20)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 25)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 17, now + 19)).to.equal(30);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 17, now + 20)).to.equal(30);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 17, now + 25)).to.equal(30);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 19, now + 20)).to.equal(70);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 19, now + 25)).to.equal(40);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 20, now + 25)).to.equal(40);
  // });

  // it("0-10 12-15 17-20 19-20", async function () {
  //   const [owner, other] = await ethers.getSigners();
  //   const FRC758 = await ethers.getContractFactory("ChaingeToken");
  //   const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);
  //   await frc758.deployed();
  //   const now = Date.parse(new Date()) / 1000;
  //   const amount1 = 10;
  //   const amount2 = 20;
  //   const amount3 = 30;
  //   const amount4 = 40;
  //   await frc758.mintTimeSlice(owner.address, amount1, now, now + 10);
  //   await frc758.mintTimeSlice(owner.address, amount2, now + 12, now + 15);
  //   await frc758.mintTimeSlice(owner.address, amount3, now + 17, now + 20);
  //   await frc758.mintTimeSlice(owner.address, amount4, now + 19, now + 20);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 10)).to.equal(10);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 15)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 17)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 19)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 20)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 15)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 17)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 19)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 20)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 25)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 15)).to.equal(20);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 17)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 19)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 20)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 17)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 19)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 20)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 17, now + 19)).to.equal(30);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 17, now + 20)).to.equal(30);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 19, now + 20)).to.equal(70);
  // });
  


  //   it("0-10 12-15 17-20 19-20", async function () {
  //   const [owner, other] = await ethers.getSigners();
  //   const FRC758 = await ethers.getContractFactory("ChaingeToken");
  //   const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);
  //   await frc758.deployed();
  //   const now = Date.parse(new Date()) / 1000;
  //   const amount1 = 10;
  //   const amount2 = 20;
  //   const amount3 = 30;
  //   const amount4 = 40;
  //   await frc758.mintTimeSlice(owner.address, amount1, now, now + 10);
  //   await frc758.mintTimeSlice(owner.address, amount2, now + 12, now + 15);
  //   await frc758.mintTimeSlice(owner.address, amount3, now + 17, now + 20);
  //   await frc758.mintTimeSlice(owner.address, amount4, now + 19, now + 20);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 10)).to.equal(10);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 15)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 17)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 19)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 20)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 15)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 17)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 19)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 20)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 25)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 15)).to.equal(20);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 17)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 19)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 20)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 17)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 19)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 20)).to.equal(0);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 17, now + 19)).to.equal(30);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 17, now + 20)).to.equal(30);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 19, now + 20)).to.equal(70);
  // });

});
