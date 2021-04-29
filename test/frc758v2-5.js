const { expect } = require("chai");
describe("safeTransferFrom", function () {
  it("transferFrom all", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);

    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount = 1000;
    await frc758.mintTimeSlice(owner.address, amount, now, now + 1000);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 1000)).to.equal(amount);

    await frc758.timeSliceTransferFrom(owner.address, other.address, 1000, now, now + 1000);

    expect(await frc758.timeBalanceOf(owner.address, now, now + 1000)).to.equal(0);
  });

  it("transferFrom 1", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);

    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount = 1000;
    await frc758.mintTimeSlice(owner.address, amount, now, now + 1000);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 1000)).to.equal(amount);

    await frc758.timeSliceTransferFrom(owner.address, other.address, amount, now, now + 500); //sub 0-50

    expect(await frc758.timeBalanceOf(owner.address, now, now + 500)).to.equal(0);
    // expect(await frc758.timeBalanceOf(owner.address, now + 50, now + 100)).to.equal(amount);

  })

  it("transferFrom 2", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);

    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000 + 1000;
    const amount = 1000;
    const amount2 = 2000;
    await frc758.mintTimeSlice(owner.address, amount, now, now + 100);
    await frc758.mintTimeSlice(owner.address, amount2, now + 50, now + 200);

    expect(await frc758.timeBalanceOf(owner.address, now, now + 50)).to.equal(amount);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 100)).to.equal(amount);
    expect(await frc758.timeBalanceOf(owner.address, now + 50, now + 100)).to.equal(3000);

    await frc758.timeSliceTransferFrom(owner.address, other.address, 1000, now, now + 100); //sub 0-100

    expect(await frc758.timeBalanceOf(owner.address, now, now + 100)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 50, now + 100)).to.equal(2000);
    expect(await frc758.timeBalanceOf(other.address, now, now + 50)).to.equal(0);
    // expect(await frc758.timeBalanceOf(owner.address, now + 50, now + 100)).to.equal(amount);
  })

  it("transferFrom 3", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);

    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000 + 1000;
    const amount = 1000;
    const amount2 = 2000;
    await frc758.mintTimeSlice(owner.address, amount, now, now + 100);
    await frc758.mintTimeSlice(owner.address, amount2, now + 50, now + 200);

    expect(await frc758.timeBalanceOf(owner.address, now, now + 50)).to.equal(amount);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 100)).to.equal(amount);
    expect(await frc758.timeBalanceOf(owner.address, now + 50, now + 100)).to.equal(3000);

    await frc758.timeSliceTransferFrom(owner.address, other.address, 1000, now, now + 20); //sub 0-100
    expect(await frc758.timeBalanceOf(owner.address, now, now + 20)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 22)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 100)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 22, now + 100)).to.equal(1000);
    expect(await frc758.timeBalanceOf(owner.address, now + 50, now + 100)).to.equal(3000);
    expect(await frc758.timeBalanceOf(other.address, now, now + 50)).to.equal(0);
  })

  it("transferFrom 4", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);

    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount = 1000;
    const amount2 = 2000;
    await frc758.mintTimeSlice(owner.address, amount, now, now + 1000);
    await frc758.mintTimeSlice(owner.address, amount2, now + 500, now + 2000);
    await frc758.timeSliceTransferFrom(owner.address, other.address, 1000, now + 650, now + 750);
    // await frc758.timeSliceTransferFrom(owner.address, other.address, 1000, now + 700, now + 720);

    const res = await frc758.sliceOf(owner.address)
    const _res = res.map((val) => {
      return val.map((v) => {
        return parseInt(v._hex)
      })
    })

    const format = []
    for (let k in _res[0]) {
      const amount = _res[0][k]
      const start = _res[1][k] - now
      const end = _res[2][k] - now 
      format.push({
        start,
        end,
        amount
      })
    }
    console.log(format);
    // error

    expect(await frc758.timeBalanceOf(owner.address, now, now + 500)).to.equal(1000);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 100)).to.equal(1000);
    expect(await frc758.timeBalanceOf(owner.address, now + 500, now + 1000)).to.equal(2000);
    
    expect(await frc758.timeBalanceOf(other.address, now+700, now + 720)).to.equal(1000);
    expect(await frc758.timeBalanceOf(owner.address, now + 500, now + 1000)).to.equal(2000);
  })

  it("transferFrom 5", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);

    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const basicTime = 50;
    const amount = 100;
    await frc758.mint(owner.address, amount);

    // expect(await frc758.timeBalanceOf(owner.address, now, now + 50)).to.equal(amount);

    await frc758.timeSliceTransferFrom(owner.address, other.address, 2, now, now + 10000); //sub 0-100
    expect(await frc758.timeBalanceOf(owner.address, now + basicTime, now + 99)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + basicTime, now + 5000)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 5000, now + 10000)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 5000, '184467440737095551615')).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 10000, '18446744073709551615')).to.equal(2);


    await frc758.timeSliceTransferFrom(owner.address, other.address, 1, now + 5000, '18446744073709551615'); //sub 0-100
    // error
    // expect(await frc758.timeBalanceOf(owner.address, now + basicTime, now + 5000)).to.equal(1);

    // console.log(now);
    // expect(await frc758.timeBalanceOf(owner.address, now + basicTime, now + basicTime + 99)).to.equal(1);
    expect(await frc758.timeBalanceOf(owner.address, now + basicTime + 5000, '18446744073709551615')).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + basicTime + 5000, now + 10000)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + basicTime + 10000, '18446744073709551615')).to.equal(2);
    expect(await frc758.timeBalanceOf(owner.address, now + basicTime + 100, '18446744073709551615')).to.equal(0);


    await frc758.timeSliceTransferFrom(owner.address, other.address, 1, now + 10000, '18446744073709551615'); //sub 0-100
    
    expect(await frc758.timeBalanceOf(owner.address, now + basicTime, now + 9999)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + basicTime + 9999, now + 10000)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + basicTime + 10000, '18446744073709551615')).to.equal(1);

    // const res = await frc758.sliceOf(owner.address)
    // const _res = res.map((val) => {
    //   return val.map((v) => {
    //     return parseInt(v._hex)
    //   })
    // })

    // const format = []
    // for (let k in _res[0]) {
    //   const amount = _res[0][k]
    //   const start = _res[1][k] - now + 100
    //   const end = _res[2][k] - now + 100
    //   format.push({
    //     start,
    //     end,
    //     amount
    //   })
    // }
    // console.log(format);

  })
})
