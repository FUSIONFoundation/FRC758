const { expect } = require("chai");

describe("FRC758", function () {

  // ————————————mintTimeSlice frames and burn———————————— 
  it("0-10 10-15 15-20", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ExampleToken");
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

    await frc758.burnTimeSlice(owner.address, 5, now1 + 5, now1 + 12);

    expect(await frc758.timeBalanceOf(owner.address, now1, now2)).to.equal(5);
    // expect(await frc758.timeBalanceOf(owner.address, now1, now4)).to.equal(5);
    expect(await frc758.timeBalanceOf(owner.address, now1, now6)).to.equal(5);
    expect(await frc758.timeBalanceOf(owner.address, now2, now4)).to.equal(15);
    expect(await frc758.timeBalanceOf(owner.address, now2, now6)).to.equal(15);
    expect(await frc758.timeBalanceOf(owner.address, now4, now6)).to.equal(30);
  });
});
