const { expect } = require("chai");

describe("FRC758", function () {
  it("mint1", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ExampleToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18);

    await frc758.deployed();
    const now = Date.parse(new Date()) / 1000;
    const amount = 1000;
    await frc758.mint(owner.address, amount, now, now + 100);
    expect(await frc758.timetimeBalanceOf(owner.address, now, now + 100)).to.equal(amount);
  });
});
