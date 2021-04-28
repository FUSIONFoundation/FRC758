const { expect } = require("chai");
describe("safeTransferFrom", function () {
  // it("transferFrom all", async function () {
  //   const [owner, other] = await ethers.getSigners();
  //   const FRC758 = await ethers.getContractFactory("ChaingeToken");
  //   const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);

  //   await frc758.deployed();
  //   const now = Date.parse(new Date()) / 1000;
  //   const amount = 1000;
  //   await frc758.mintTimeSlice(owner.address, amount, now, now + 100);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 100)).to.equal(amount);

  //   await frc758.timeSliceTransferFrom(owner.address, other.address, 1000, now, now + 100);

  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 100)).to.equal(0);
  // });

  // it("transferFrom ", async function () {
  //   const [owner, other] = await ethers.getSigners();
  //   const FRC758 = await ethers.getContractFactory("ChaingeToken");
  //   const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);

  //   await frc758.deployed();
  //   const now = Date.parse(new Date()) / 1000;
  //   const amount = 1000;
  //   await frc758.mintTimeSlice(owner.address, amount, now, now + 100);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 100)).to.equal(amount);

  //   await frc758.timeSliceTransferFrom(owner.address, other.address, amount, now, now + 50); //sub 0-50

  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 50)).to.equal(0);
  //   // expect(await frc758.timeBalanceOf(owner.address, now + 50, now + 100)).to.equal(amount);

  // })

  // it("transferFrom ", async function () {
  //   const [owner, other] = await ethers.getSigners();
  //   const FRC758 = await ethers.getContractFactory("ChaingeToken");
  //   const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);

  //   await frc758.deployed();
  //   const now = Date.parse(new Date()) / 1000 + 1000;
  //   const amount = 1000;
  //   const amount2 = 2000;
  //   await frc758.mintTimeSlice(owner.address, amount, now, now + 100);
  //   await frc758.mintTimeSlice(owner.address, amount2, now + 50, now + 200);

  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 50)).to.equal(amount);
  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 100)).to.equal(amount);
  //   expect(await frc758.timeBalanceOf(owner.address, now + 50, now + 100)).to.equal(3000);

  //   await frc758.timeSliceTransferFrom(owner.address, other.address, 1000, now, now + 100); //sub 0-100

  //   expect(await frc758.timeBalanceOf(owner.address, now, now + 100)).to.equal(0);

  //   expect(await frc758.timeBalanceOf(owner.address, now+50, now + 100)).to.equal(2000);

  //   expect(await frc758.timeBalanceOf(other.address, now, now + 50)).to.equal(0);
  //   // expect(await frc758.timeBalanceOf(owner.address, now + 50, now + 100)).to.equal(amount);

  // })

  it("transferFrom ", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);

    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount = 100;
    await frc758.mint(owner.address, amount);

    // expect(await frc758.timeBalanceOf(owner.address, now, now + 50)).to.equal(amount);

    await frc758.timeSliceTransferFrom(owner.address, other.address, 2, now, now + 100); //sub 0-100

    expect(await frc758.timeBalanceOf(owner.address, now, now+99)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now+100, '18446744073709551615')).to.equal(2);


    await frc758.timeSliceTransferFrom(owner.address, other.address, 1, now + 100-1, '18446744073709551615'); //sub 0-100
    console.log('查询余额', now + 29, now+ 100-1);
    expect(await frc758.timeBalanceOf(owner.address, now , now+ 100-1)).to.equal(1);

    // expect(await frc758.timeBalanceOf(owner.address, now+99, now+100)).to.equal(0);
    // expect(await frc758.timeBalanceOf(owner.address, now+100, '18446744073709551615')).to.equal(2);


    // await frc758.timeSliceTransferFrom(owner.address, other.address, 1, now + 100, '18446744073709551615'); //sub 0-100



    // expect(await frc758.timeBalanceOf(owner.address, now, now+99)).to.equal(2);
    // expect(await frc758.timeBalanceOf(owner.address, now+99, now+100)).to.equal(0);
    // expect(await frc758.timeBalanceOf(owner.address, now+100, '18446744073709551615')).to.equal(1);


    // console.log('当前时间:', now+99, now+100);
    // expect(await frc758.timeBalanceOf(other.address, now+99, now+100)).to.equal(0);
  })
})
