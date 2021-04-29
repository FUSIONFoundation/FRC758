const { expect } = require("chai");
describe("safeTransferFrom", function () {
  it("transferFrom all", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);

    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount = 1000;
    await frc758.mintTimeSlice(owner.address, amount, now, now + 100);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 100)).to.equal(amount);

    await frc758.timeSliceTransferFrom(owner.address, other.address, 1000, now, now + 100);

    expect(await frc758.timeBalanceOf(owner.address, now, now + 100)).to.equal(0);
  });

  it("transferFrom ", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);

    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount = 1000;
    await frc758.mintTimeSlice(owner.address, amount, now, now + 100);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 100)).to.equal(amount);

    await frc758.timeSliceTransferFrom(owner.address, other.address, amount, now, now + 50); //sub 0-50

    expect(await frc758.timeBalanceOf(owner.address, now, now + 50)).to.equal(0);
    // expect(await frc758.timeBalanceOf(owner.address, now + 50, now + 100)).to.equal(amount);

  })

  it("transferFrom ", async function () {
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

  it("transferFrom ", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);

    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const basicTime = 30;
    const amount = 100;
    await frc758.mint(owner.address, amount);

    // expect(await frc758.timeBalanceOf(owner.address, now, now + 50)).to.equal(amount);

    await frc758.timeSliceTransferFrom(owner.address, other.address, 2, now, now + 10000); //sub 0-100
    expect(await frc758.timeBalanceOf(owner.address, now, now + 99)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 5000)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 5000, now + 10000)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 5000, '184467440737095551615')).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 10000, '18446744073709551615')).to.equal(2);


    await frc758.timeSliceTransferFrom(owner.address, other.address, 1, now + 5000, '18446744073709551615'); //sub 0-100
    expect(await frc758.timeBalanceOf(owner.address, now + basicTime, now + 5000)).to.equal(1);
    // console.log(now);
    expect(await frc758.timeBalanceOf(owner.address, now + basicTime, now + basicTime + 99)).to.equal(1);
    expect(await frc758.timeBalanceOf(owner.address, now + basicTime + 5000, '18446744073709551615')).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + basicTime + 5000, now + 10000)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + basicTime + 10000, '18446744073709551615')).to.equal(2);
    expect(await frc758.timeBalanceOf(owner.address, now + basicTime + 100, '18446744073709551615')).to.equal(0);


    await frc758.timeSliceTransferFrom(owner.address, other.address, 1, now + 100, '18446744073709551615'); //sub 0-100
    expect(await frc758.timeBalanceOf(owner.address, now + basicTime, now + 99)).to.equal(2);
    expect(await frc758.timeBalanceOf(owner.address, now + basicTime + 99, now + basicTime + 100)).to.equal(1);
    expect(await frc758.timeBalanceOf(owner.address, now + basicTime + 100, '18446744073709551615')).to.equal(0);


    // console.log('当前时间:', now+99, now+100);
    // expect(await frc758.timeBalanceOf(other.address, now + 99, now + 100)).to.equal(0);


    const res = await frc758.sliceOf(owner.address)
    const _res = res.map((val) => {
      return val.map((v) => {
        return parseInt(v._hex)
      })
    })

    // console.log(_res);
    // const count = _res[0].length;

    const format = []
    for (let k in _res[0]) {
      const amount = _res[0][k]
      const start = _res[1][k]
      const end = _res[2][k]
      format.push({
        start,
        end,
        amount
      })
    }
    console.log(format);

  })
})
