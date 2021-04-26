const { expect } = require("chai");

describe("FRC758", function () {
  it("clean", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);

    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount = 1000;
    await frc758.mintTimeSlice(owner.address, amount, now, now + 100);
    await frc758.clean(owner.address, now, now + 100);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 100)).to.equal(amount);
  });

  // ————————————clean 2 frames———————————— 
  // 0-10 10-∞
  it("0-10 10-∞", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);

    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount1 = 10;
    const amount2 = 20;
    await frc758.mintTimeSlice(owner.address, amount1, now, now + 10);
    await frc758.mintTimeSlice(owner.address, amount2, now + 10, now + 666666666666);
    await frc758.clean(owner.address, now, now + 666666666666);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 666666666666)).to.equal(10);
  });
  // 0-10 5-∞
  it("0-10 5-∞", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);

    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount1 = 10;
    const amount2 = 20;
    await frc758.mintTimeSlice(owner.address, amount1, now, now + 10);
    await frc758.mintTimeSlice(owner.address, amount2, now + 5, now + 666666666666);
    await frc758.clean(owner.address, now, now + 666666666666);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 666666666666)).to.equal(10);
  });

  // ————————————clean 3 frames———————————— 
  it("0-10 10-15 15-20", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);
    await frc758.deployed();
    const now1 = Date.parse(new Date()) / 1000;
    const now2 = now1 + 10;
    const now3 = now1 + 10;
    const now4 = now1 + 15;
    const now5 = now1 + 15;
    const now6 = now1 + 20;
    const amount1 = 10;
    const amount2 = 20;
    const amount3 = 30;
    await frc758.mintTimeSlice(owner.address, amount1, now1, now2);
    await frc758.mintTimeSlice(owner.address, amount2, now3, now4);
    await frc758.mintTimeSlice(owner.address, amount3, now5, now6);
    await frc758.clean(owner.address, now1, now1 + 20);
    expect(await frc758.timeBalanceOf(owner.address, now1, now2)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now1, now4)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now1, now6)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now2, now4)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now2, now6)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now4, now6)).to.equal(10);
  });

  it("0-10 10-15 12-20", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);
    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount1 = 10;
    const amount2 = 20;
    const amount3 = 30;
    await frc758.mintTimeSlice(owner.address, amount1, now, now + 10);
    await frc758.mintTimeSlice(owner.address, amount2, now + 10, now + 15);
    await frc758.mintTimeSlice(owner.address, amount3, now + 12, now + 20);
    await frc758.clean(owner.address, now, now + 20);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 10)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 12)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 15)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 20)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 12)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 15)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 20)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 15)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 20)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 20)).to.equal(10);
  });

  it("0-10 10-15 10-22", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);
    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount1 = 10;
    const amount2 = 20;
    const amount3 = 30;
    await frc758.mintTimeSlice(owner.address, amount1, now, now + 10);
    await frc758.mintTimeSlice(owner.address, amount2, now + 10, now + 15);
    await frc758.mintTimeSlice(owner.address, amount3, now + 10, now + 22);
    await frc758.clean(owner.address, now, now + 22);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 10)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 15)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 22)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 15)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 22)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 22)).to.equal(10);
  });

  it("0-10 10-15 5-20", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);
    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount1 = 10;
    const amount2 = 20;
    const amount3 = 30;
    await frc758.mintTimeSlice(owner.address, amount1, now, now + 10);
    await frc758.mintTimeSlice(owner.address, amount2, now + 10, now + 15);
    await frc758.mintTimeSlice(owner.address, amount3, now + 5, now + 20);
    await frc758.clean(owner.address, now, now + 20);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 5)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 10)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 15)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 20)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 5, now + 10)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 5, now + 15)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 5, now + 20)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 15)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 20)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 20)).to.equal(10);
  });

  it("0-10 10-15 0-20", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);
    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount1 = 10;
    const amount2 = 20;
    const amount3 = 30;
    await frc758.mintTimeSlice(owner.address, amount1, now, now + 10);
    await frc758.mintTimeSlice(owner.address, amount2, now + 10, now + 15);
    await frc758.mintTimeSlice(owner.address, amount3, now, now + 20);
    await frc758.clean(owner.address, now, now + 20);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 10)).to.equal(30);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 15)).to.equal(30);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 20)).to.equal(30);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 15)).to.equal(30);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 20)).to.equal(30);
    expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 20)).to.equal(30);
  });

  it("0-10 10-15 18-20", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);
    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount1 = 10;
    const amount2 = 20;
    const amount3 = 30;
    await frc758.mintTimeSlice(owner.address, amount1, now, now + 10);
    await frc758.mintTimeSlice(owner.address, amount2, now + 10, now + 15);
    await frc758.mintTimeSlice(owner.address, amount3, now + 18, now + 20);
    await frc758.clean(owner.address, now, now + 15);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 10)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 15)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 18)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 20)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 15)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 18)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 20)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 18)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 20)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 18, now + 20)).to.equal(30);
  });

  it("0-20 5-10 10-15", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);
    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount1 = 10;
    const amount2 = 20;
    const amount3 = 30;
    await frc758.mintTimeSlice(owner.address, amount1, now, now + 20);
    await frc758.mintTimeSlice(owner.address, amount2, now + 5, now + 10);
    await frc758.mintTimeSlice(owner.address, amount3, now + 10, now + 15);
    await frc758.clean(owner.address, now, now + 15);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 5)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 10)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 15)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 20)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 5, now + 10)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 5, now + 15)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 5, now + 20)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 15)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 20)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 20)).to.equal(10);
  });

  it("0-10 0-5 15-20", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);
    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount1 = 10;
    const amount2 = 20;
    const amount3 = 30;
    await frc758.mintTimeSlice(owner.address, amount1, now, now + 10);
    await frc758.mintTimeSlice(owner.address, amount2, now + 0, now + 5);
    await frc758.mintTimeSlice(owner.address, amount3, now + 15, now + 20);
    await frc758.clean(owner.address, now, now + 10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 5)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 10)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 15)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 20)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 5, now + 10)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 5, now + 15)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 5, now + 20)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 15)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 20)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 20)).to.equal(30);
  });

  it("0-10 5-20 15-20", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);
    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount1 = 10;
    const amount2 = 20;
    const amount3 = 30;
    await frc758.mintTimeSlice(owner.address, amount1, now, now + 10);
    await frc758.mintTimeSlice(owner.address, amount2, now + 5, now + 20);
    await frc758.mintTimeSlice(owner.address, amount3, now + 15, now + 20);
    await frc758.clean(owner.address, now, now + 20);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 5)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 10)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 15)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 20)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 5, now + 10)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 5, now + 15)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 5, now + 20)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 15)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 20)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 20)).to.equal(10);
  });

  // ————————————clean 4 frames———————————— 
  it("0-10 10-15 15-20 20-25", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);
    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount1 = 10;
    const amount2 = 20;
    const amount3 = 30;
    const amount4 = 40;
    await frc758.mintTimeSlice(owner.address, amount1, now, now + 10);
    await frc758.mintTimeSlice(owner.address, amount2, now + 10, now + 15);
    await frc758.mintTimeSlice(owner.address, amount3, now + 15, now + 20);
    await frc758.mintTimeSlice(owner.address, amount4, now + 20, now + 25);
    await frc758.clean(owner.address, now, now + 25);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 10)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 15)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 20)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 25)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 15)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 20)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 25)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 20)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 25)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now + 20, now + 25)).to.equal(10);
  });

  it("0-10 12-15 17-20 19-25", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);
    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount1 = 10;
    const amount2 = 20;
    const amount3 = 30;
    const amount4 = 40;
    await frc758.mintTimeSlice(owner.address, amount1, now, now + 10);
    await frc758.mintTimeSlice(owner.address, amount2, now + 12, now + 15);
    await frc758.mintTimeSlice(owner.address, amount3, now + 17, now + 20);
    await frc758.mintTimeSlice(owner.address, amount4, now + 19, now + 25);
    // 故意clean错误的时间段，其结果应该为0
    await frc758.clean(owner.address, now, now + 15);
    await frc758.clean(owner.address, now + 17, now + 25);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 10)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 12)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 15)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 17)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 19)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 20)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 25)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 15)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 17)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 19)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 20)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 25)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 15)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 17)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 19)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 20)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 25)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 17)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 19)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 20)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 25)).to.equal(0);

    expect(await frc758.timeBalanceOf(owner.address, now + 17, now + 19)).to.equal(30);
    expect(await frc758.timeBalanceOf(owner.address, now + 17, now + 20)).to.equal(30);
    expect(await frc758.timeBalanceOf(owner.address, now + 17, now + 25)).to.equal(30);
    expect(await frc758.timeBalanceOf(owner.address, now + 19, now + 20)).to.equal(30);
    expect(await frc758.timeBalanceOf(owner.address, now + 19, now + 25)).to.equal(30);
    expect(await frc758.timeBalanceOf(owner.address, now + 20, now + 25)).to.equal(30);
  });

  it("0-10 12-15 17-20 19-20", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);
    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount1 = 10;
    const amount2 = 20;
    const amount3 = 30;
    const amount4 = 40;
    await frc758.mintTimeSlice(owner.address, amount1, now, now + 10);
    await frc758.mintTimeSlice(owner.address, amount2, now + 12, now + 15);
    await frc758.mintTimeSlice(owner.address, amount3, now + 17, now + 20);
    await frc758.mintTimeSlice(owner.address, amount4, now + 19, now + 20);
    await frc758.clean(owner.address, now + 17, now + 20);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 10)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 15)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 17)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 19)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 20)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 15)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 17)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 19)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 20)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 10, now + 25)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 15)).to.equal(20);
    expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 17)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 19)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 12, now + 20)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 17)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 19)).to.equal(0);
    expect(await frc758.timeBalanceOf(owner.address, now + 15, now + 20)).to.equal(0);

    expect(await frc758.timeBalanceOf(owner.address, now + 17, now + 19)).to.equal(30);

    expect(await frc758.timeBalanceOf(owner.address, now + 17, now + 20)).to.equal(30);
    expect(await frc758.timeBalanceOf(owner.address, now + 19, now + 20)).to.equal(30);
  });

  it("0-10 12-15 0-15", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);
    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount1 = 10;
    const amount2 = 20;
    const amount3 = 30;
    const amount4 = 40;
    await frc758.mintTimeSlice(owner.address, amount1, now, now + 10);
    await frc758.mintTimeSlice(owner.address, amount2, now + 12, now + 15);
    await frc758.mintTimeSlice(owner.address, amount3, now, now + 15);
    await frc758.clean(owner.address, now + 0, now + 15);

    expect(await frc758.timeBalanceOf(owner.address, now, now + 10)).to.equal(30);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 15)).to.equal(30);
  });

  it("0-10 12-15 17-20 19-20", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);
    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount1 = 10;
    const amount2 = 20;
    const amount3 = 30;
    const amount4 = 40;
    await frc758.mintTimeSlice(owner.address, amount1, now, now + 10);
    await frc758.mintTimeSlice(owner.address, amount2, now + 12, now + 15);
    await frc758.mintTimeSlice(owner.address, amount3, now, now + 15);
    await frc758.clean(owner.address, now + 12, now + 15);

    expect(await frc758.timeBalanceOf(owner.address, now, now + 10)).to.equal(40);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 15)).to.equal(30);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 12)).to.equal(30);
    expect(await frc758.timeBalanceOf(owner.address, now+10, now + 12)).to.equal(30);
    expect(await frc758.timeBalanceOf(owner.address, now+10, now + 15)).to.equal(30);
    expect(await frc758.timeBalanceOf(owner.address, now+12, now + 15)).to.equal(50);
  });

  it("0-18446744073709551615", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);
    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount1 = 10;
    const amount2 = 20;
    const amount3 = 30;
    const amount4 = 40;
    await frc758.mintTimeSlice(owner.address, amount1, now, '18446744073709551615');
    await frc758.mintTimeSlice(owner.address, amount2, now + 12, now + 15);
    await frc758.mintTimeSlice(owner.address, amount3, now, now + 25);
    await frc758.clean(owner.address, now, '18446744073709551615');

    expect(await frc758.timeBalanceOf(owner.address, now, '18446744073709551615')).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 15)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 12)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now+10, now + 12)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now+10, now + 15)).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now+12, now + 15)).to.equal(10);
  });

  it("0-18446744073709551615", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ChaingeToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18, 100000000000000);
    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount1 = 10;
    const amount2 = 20;
    const amount3 = 30;
    const amount4 = 40;
    await frc758.mintTimeSlice(owner.address, amount1, now, '18446744073709551615');
    await frc758.mintTimeSlice(owner.address, amount2, now + 12, now + 15);
    await frc758.mintTimeSlice(owner.address, amount3, now, now + 25);
    await frc758.clean(owner.address, now + 15, '18446744073709551615');

    expect(await frc758.timeBalanceOf(owner.address, now, now + 12)).to.equal(40);
    expect(await frc758.timeBalanceOf(owner.address, now, now + 15)).to.equal(40);
    expect(await frc758.timeBalanceOf(owner.address, now, '18446744073709551615')).to.equal(10);
    expect(await frc758.timeBalanceOf(owner.address, now+10, now + 12)).to.equal(40);
    expect(await frc758.timeBalanceOf(owner.address, now+12, now + 15)).to.equal(60);
    expect(await frc758.timeBalanceOf(owner.address, now+15, now + 25)).to.equal(10);
  });
});
