const { expect } = require("chai");

describe("ExampleToken", function() {
  it("Should mint a slice token return the new slice Token", async function() {
    const Greeter = await ethers.getContractFactory("ExampleToken");
    const greeter = await Greeter.deploy("SLICE", "SLI", 18);
    
    await greeter.deployed();
    // expect(await greeter.greet()).to.equal("Hello, world!");

    // await greeter.setGreeting("Hola, mundo!");
    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
