const { expect } = require("chai");

describe("FRC758", function () {
  it("mint1", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ExampleToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18);

    await frc758.deployed();
    const now = +new Date();
    const amount = 1000;
    await frc758.mint(owner.address, amount, now, now + 100);
    expect(await frc758.balanceOf(owner.address, now, now + 100)).to.equal(amount);
  });

  // ————————————mint 2 frames———————————— 
  // 0-10 10-∞
  it("0-10 10-∞", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ExampleToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18);

    await frc758.deployed();
    const now = +new Date();
    const amount1 = 10;
    const amount2 = 20;
    await frc758.mint(owner.address, amount1, now, now + 10);
    await frc758.mint(owner.address, amount2, now + 10, now + 666666666666);
    expect(await frc758.balanceOf(owner.address, now, now + 10)).to.equal(10)
    expect(await frc758.balanceOf(owner.address, now, now + 666666666666)).to.equal(10);
    expect(await frc758.balanceOf(owner.address, now + 10, now + 666666666666)).to.equal(20);
  });
  // 0-10 5-∞
  it("0-10 5-∞", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ExampleToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18);

    await frc758.deployed();
    const now = +new Date();
    const amount1 = 10;
    const amount2 = 20;
    await frc758.mint(owner.address, amount1, now, now + 10);
    await frc758.mint(owner.address, amount2, now + 5, now + 666666666666);
    expect(await frc758.balanceOf(owner.address, now, now + 5)).to.equal(10);
    expect(await frc758.balanceOf(owner.address, now, now + 10)).to.equal(10);
    expect(await frc758.balanceOf(owner.address, now, now + 666666666666)).to.equal(10);
    expect(await frc758.balanceOf(owner.address, now + 5, now + 10)).to.equal(30);
    expect(await frc758.balanceOf(owner.address, now + 5, now + 666666666666)).to.equal(20);
    expect(await frc758.balanceOf(owner.address, now + 10, now + 666666666666)).to.equal(20);
  });
  // 0-10 11-∞
  it("0-10 11-∞", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ExampleToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18);

    await frc758.deployed();
    const now = +new Date();
    const amount1 = 10;
    const amount2 = 20;
    await frc758.mint(owner.address, amount1, now, now + 10);
    await frc758.mint(owner.address, amount2, now + 11, now + 666666666666);
    expect(await frc758.balanceOf(owner.address, now, now + 10)).to.equal(10);
    expect(await frc758.balanceOf(owner.address, now, now + 11)).to.equal(0);
    expect(await frc758.balanceOf(owner.address, now, now + 666666666666)).to.equal(0);
    expect(await frc758.balanceOf(owner.address, now + 10, now + 11)).to.equal(0);
    expect(await frc758.balanceOf(owner.address, now + 10, now + 666666666666)).to.equal(0);
    expect(await frc758.balanceOf(owner.address, now + 11, now + 666666666666)).to.equal(20);
  });
  // 0-10 10-11
  it("0-10 10-11", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ExampleToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18);

    await frc758.deployed();
    const now = +new Date();
    const amount1 = 10;
    const amount2 = 20;
    await frc758.mint(owner.address, amount1, now, now + 10);
    await frc758.mint(owner.address, amount2, now + 10, now + 11);
    expect(await frc758.balanceOf(owner.address, now, now + 10)).to.equal(10);
    expect(await frc758.balanceOf(owner.address, now, now + 11)).to.equal(10);
    expect(await frc758.balanceOf(owner.address, now + 10, now + 11)).to.equal(20);
  });
  // 0-10 1-2
  it("0-10 1-2", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ExampleToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18);

    await frc758.deployed();
    const now = +new Date();
    const amount1 = 10;
    const amount2 = 20;
    await frc758.mint(owner.address, amount1, now, now + 10);
    await frc758.mint(owner.address, amount2, now + 1, now + 2);
    expect(await frc758.balanceOf(owner.address, now, now + 1)).to.equal(10);
    expect(await frc758.balanceOf(owner.address, now, now + 2)).to.equal(10);
    expect(await frc758.balanceOf(owner.address, now, now + 10)).to.equal(10);
    expect(await frc758.balanceOf(owner.address, now + 1, now + 2)).to.equal(30);
    expect(await frc758.balanceOf(owner.address, now + 1, now + 10)).to.equal(10);
    expect(await frc758.balanceOf(owner.address, now + 2, now + 10)).to.equal(10);
  });
  // 0-10 11-12
  it("0-10 11-12", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ExampleToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18);

    await frc758.deployed();
    const now = +new Date();
    const amount1 = 10;
    const amount2 = 20;
    await frc758.mint(owner.address, amount1, now, now + 10);
    await frc758.mint(owner.address, amount2, now + 11, now + 12);
    expect(await frc758.balanceOf(owner.address, now, now + 10)).to.equal(10);
    expect(await frc758.balanceOf(owner.address, now, now + 11)).to.equal(0);
    expect(await frc758.balanceOf(owner.address, now, now + 12)).to.equal(0);
    expect(await frc758.balanceOf(owner.address, now + 10, now + 11)).to.equal(0);
    expect(await frc758.balanceOf(owner.address, now + 10, now + 12)).to.equal(0);
    expect(await frc758.balanceOf(owner.address, now + 11, now + 12)).to.equal(20);
  });
  // 0-10 5-10
  it("0-10 5-10", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ExampleToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18);

    await frc758.deployed();
    const now = +new Date();
    const amount1 = 10;
    const amount2 = 20;
    await frc758.mint(owner.address, amount1, now, now + 10);
    await frc758.mint(owner.address, amount2, now + 5, now + 10);
    expect(await frc758.balanceOf(owner.address, now, now + 5)).to.equal(10);
    expect(await frc758.balanceOf(owner.address, now, now + 10)).to.equal(10);
    expect(await frc758.balanceOf(owner.address, now + 5, now + 10)).to.equal(30);
  });
});
