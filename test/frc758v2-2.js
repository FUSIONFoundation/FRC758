const { expect } = require("chai");

describe("FRC758", function () {
    it("mint1", async function () {
        const [owner, other] = await ethers.getSigners();
        const FRC758 = await ethers.getContractFactory("ExampleToken");
        const frc758 = await FRC758.deploy("Hello", "HH", 18);
    
        await frc758.deployed();
        const now = 0;
        const amount = 1000;
        await frc758.mint(owner.address, amount, now, now + 100);
        expect(await frc758.balanceOf(owner.address, now, now + 100)).to.equal(amount);
      });
    
      // ————————————mint2———————————— 
      // 0-10 10-∞
      it("0-10 10-∞", async function () {
        const [owner, other] = await ethers.getSigners();
        const FRC758 = await ethers.getContractFactory("ExampleToken");
        const frc758 = await FRC758.deploy("Hello", "HH", 18);
    
        await frc758.deployed();
        const now = 0;
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
        const now = 0;
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
        const now = 0;
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
        const now = 0;
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
        const now = 0;
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
        const now = 0;
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
        const now = 0;
        const amount1 = 10;
        const amount2 = 20;
        await frc758.mint(owner.address, amount1, now, now + 10);
        await frc758.mint(owner.address, amount2, now + 5, now + 10);
        expect(await frc758.balanceOf(owner.address, now, now + 5)).to.equal(10);
        expect(await frc758.balanceOf(owner.address, now, now + 10)).to.equal(10);
        expect(await frc758.balanceOf(owner.address, now + 5, now + 10)).to.equal(30);
      });
  // ————————————liuxiaobin start———————————— 

  //测试一下最基础的balanceOf返回对不对
  it("2,100-200", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ExampleToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18);

    await frc758.deployed();
    await frc758.mint(owner.address, 1000, 100, 200);
    //1
    expect(await frc758.balanceOf(owner.address, 50, 150)).to.equal(0);
    //2
    expect(await frc758.balanceOf(owner.address, 140, 160)).to.equal(1000);
    //3
    expect(await frc758.balanceOf(owner.address, 150, 250)).to.equal(0);
    //4
    expect(await frc758.balanceOf(owner.address, 150, 666666666666)).to.equal(0);
    //5
    expect(await frc758.balanceOf(owner.address, 50, 250)).to.equal(0);

    //22
    expect(await frc758.balanceOf(owner.address, 50, 100)).to.equal(0);
    //23
    expect(await frc758.balanceOf(owner.address, 100, 200)).to.equal(1000);
    //24
    expect(await frc758.balanceOf(owner.address, 200, 250)).to.equal(0);
    //25
    expect(await frc758.balanceOf(owner.address, 200, 666666666666)).to.equal(0);
    //26
    expect(await frc758.balanceOf(owner.address, 100, 250)).to.equal(0);
    //27
    expect(await frc758.balanceOf(owner.address, 100, 666666666666)).to.equal(0);
    //28
    expect(await frc758.balanceOf(owner.address, 50, 200)).to.equal(0);
  });

  it("3,100-200,300-400", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ExampleToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18);

    await frc758.deployed();
    await frc758.mint(owner.address, 1000, 100, 200);
    await frc758.mint(owner.address, 2000, 300, 400);
    //6
    expect(await frc758.balanceOf(owner.address, 50, 350)).to.equal(0);
    //7
    expect(await frc758.balanceOf(owner.address, 150, 450)).to.equal(0);
    //8
    expect(await frc758.balanceOf(owner.address, 150, 666666666666)).to.equal(0);
    //9
    expect(await frc758.balanceOf(owner.address, 150, 350)).to.equal(0);
    //10
    expect(await frc758.balanceOf(owner.address, 50, 450)).to.equal(0);
    //11
    expect(await frc758.balanceOf(owner.address, 50, 666666666666)).to.equal(0);

    //29
    expect(await frc758.balanceOf(owner.address, 200, 300)).to.equal(0);
    //30
    expect(await frc758.balanceOf(owner.address, 50, 300)).to.equal(0);
    //31
    expect(await frc758.balanceOf(owner.address, 100, 300)).to.equal(0);
    //33
    expect(await frc758.balanceOf(owner.address, 100, 400)).to.equal(0);
    //34
    expect(await frc758.balanceOf(owner.address, 100, 666666666666)).to.equal(0);
    //35
    expect(await frc758.balanceOf(owner.address, 200, 400)).to.equal(0);
    //36
    expect(await frc758.balanceOf(owner.address, 200, 666666666666)).to.equal(0);

  });

  it("4,100-200,200-400", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ExampleToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18);

    await frc758.deployed();
    await frc758.mint(owner.address, 1000, 100, 200);
    await frc758.mint(owner.address, 2000, 200, 400);
    //12
    expect(await frc758.balanceOf(owner.address, 150, 350)).to.equal(1000);
    //13
    expect(await frc758.balanceOf(owner.address, 50, 350)).to.equal(0);
    //14
    expect(await frc758.balanceOf(owner.address, 150, 450)).to.equal(0);
    //15
    expect(await frc758.balanceOf(owner.address, 150, 666666666666)).to.equal(0);
    //16
    expect(await frc758.balanceOf(owner.address, 50, 450)).to.equal(0);
    //17
    expect(await frc758.balanceOf(owner.address, 50, 666666666666)).to.equal(0);

    //37
    expect(await frc758.balanceOf(owner.address, 100, 400)).to.equal(1000);
    //38
    expect(await frc758.balanceOf(owner.address, 100, 666666666666)).to.equal(0);
    //43
    expect(await frc758.balanceOf(owner.address, 200, 450)).to.equal(0);
    //44
    expect(await frc758.balanceOf(owner.address, 200, 666666666666)).to.equal(0);
    //45
    expect(await frc758.balanceOf(owner.address, 50, 200)).to.equal(0);

  });

  it("5,100-200,200-400,500-600", async function () {
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ExampleToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18);

    await frc758.deployed();
    await frc758.mint(owner.address, 1000, 100, 200);
    await frc758.mint(owner.address, 2000, 200, 400);
    await frc758.mint(owner.address, 3000, 500, 600);
    //18
    expect(await frc758.balanceOf(owner.address, 150, 550)).to.equal(0);
    //19
    expect(await frc758.balanceOf(owner.address, 150, 666666666666)).to.equal(0);
    //20
    expect(await frc758.balanceOf(owner.address, 50, 550)).to.equal(0);
    //21
    expect(await frc758.balanceOf(owner.address, 50, 666666666666)).to.equal(0);

    //39
    expect(await frc758.balanceOf(owner.address, 100, 600)).to.equal(0);
    //40
    expect(await frc758.balanceOf(owner.address, 100, 666666666666)).to.equal(0);
    //41
    expect(await frc758.balanceOf(owner.address, 200, 600)).to.equal(0);
    //42
    expect(await frc758.balanceOf(owner.address, 200, 666666666666)).to.equal(0);
    //46
    expect(await frc758.balanceOf(owner.address, 100, 500)).to.equal(0);

  });

  // 这里打算测试一下能想到的所有情况的mint的结果对不对,开始
  it("1.0,100-200", async function () {
    //1.之前为空
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ExampleToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18);

    await frc758.deployed();
    await frc758.mint(owner.address, 1000, 100, 200);
    expect(await frc758.balanceOf(owner.address, 50, 60)).to.equal(0);
    expect(await frc758.balanceOf(owner.address, 150, 160)).to.equal(1000);
    expect(await frc758.balanceOf(owner.address, 250, 260)).to.equal(0);
  });

  it("2.1,100-200,50-150", async function () {
    //2.1之前已经mint过一段
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ExampleToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18);

    await frc758.deployed();
    await frc758.mint(owner.address, 1000, 100, 200);
    await frc758.mint(owner.address, 1000, 50, 150);
    expect(await frc758.balanceOf(owner.address, 20, 30)).to.equal(0);
    expect(await frc758.balanceOf(owner.address, 60, 70)).to.equal(1000);
    expect(await frc758.balanceOf(owner.address, 110, 120)).to.equal(2000);
    expect(await frc758.balanceOf(owner.address, 160, 170)).to.equal(1000);
    expect(await frc758.balanceOf(owner.address, 210, 220)).to.equal(0);
  });

  it("2.2,100-200,140-160", async function () {
    //2.2之前已经mint过一段
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ExampleToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18);

    await frc758.deployed();
    await frc758.mint(owner.address, 1000, 100, 200);
    await frc758.mint(owner.address, 1000, 140, 160);
    expect(await frc758.balanceOf(owner.address, 60, 70)).to.equal(0);
    expect(await frc758.balanceOf(owner.address, 110, 120)).to.equal(1000);
    expect(await frc758.balanceOf(owner.address, 145, 155)).to.equal(2000);
    expect(await frc758.balanceOf(owner.address, 170, 180)).to.equal(1000);
    expect(await frc758.balanceOf(owner.address, 210, 220)).to.equal(0);
  });

  it("2.3,100-200,150-250", async function () {
    //2.3之前已经mint过一段
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ExampleToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18);

    await frc758.deployed();
    await frc758.mint(owner.address, 1000, 100, 200);
    await frc758.mint(owner.address, 1000, 150, 250);
    expect(await frc758.balanceOf(owner.address, 60, 70)).to.equal(0);
    expect(await frc758.balanceOf(owner.address, 110, 120)).to.equal(1000);
    expect(await frc758.balanceOf(owner.address, 170, 180)).to.equal(2000);
    expect(await frc758.balanceOf(owner.address, 210, 220)).to.equal(1000);
    expect(await frc758.balanceOf(owner.address, 260, 270)).to.equal(0);
  });

  it("2.4,100-200,150-666666666666", async function () {
    //2.4之前已经mint过一段
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ExampleToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18);

    await frc758.deployed();
    await frc758.mint(owner.address, 1000, 100, 200);
    await frc758.mint(owner.address, 1000, 150, 666666666666);
    expect(await frc758.balanceOf(owner.address, 60, 70)).to.equal(0);
    expect(await frc758.balanceOf(owner.address, 110, 120)).to.equal(1000);
    expect(await frc758.balanceOf(owner.address, 170, 180)).to.equal(2000);
    expect(await frc758.balanceOf(owner.address, 210, 220)).to.equal(1000);
    expect(await frc758.balanceOf(owner.address, 260, 270)).to.equal(1000);
  });

  it("2.5,100-200,50-250", async function () {
    //2.5之前已经mint过一段
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ExampleToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18);

    await frc758.deployed();
    await frc758.mint(owner.address, 1000, 100, 200);
    await frc758.mint(owner.address, 1000, 50, 250);
    expect(await frc758.balanceOf(owner.address, 10, 20)).to.equal(0);
    expect(await frc758.balanceOf(owner.address, 60, 70)).to.equal(1000);
    expect(await frc758.balanceOf(owner.address, 110, 120)).to.equal(2000);
    expect(await frc758.balanceOf(owner.address, 170, 180)).to.equal(2000);
    expect(await frc758.balanceOf(owner.address, 210, 220)).to.equal(1000);
    expect(await frc758.balanceOf(owner.address, 260, 270)).to.equal(0);
  });

  it("2.22,100-200,50-100", async function () {
    //2.22之前已经mint过一段
    const [owner, other] = await ethers.getSigners();
    const FRC758 = await ethers.getContractFactory("ExampleToken");
    const frc758 = await FRC758.deploy("Hello", "HH", 18);

    await frc758.deployed();
    await frc758.mint(owner.address, 1000, 100, 200);
    await frc758.mint(owner.address, 1000, 50, 100);
    expect(await frc758.balanceOf(owner.address, 10, 20)).to.equal(0);
    expect(await frc758.balanceOf(owner.address, 60, 70)).to.equal(1000);
    expect(await frc758.balanceOf(owner.address, 110, 120)).to.equal(1000);
    expect(await frc758.balanceOf(owner.address, 170, 180)).to.equal(1000);
    expect(await frc758.balanceOf(owner.address, 210, 220)).to.equal(0);
    expect(await frc758.balanceOf(owner.address, 260, 270)).to.equal(0);
  });
  // 这里打算测试一下能想到的所有情况的mint的结果对不对,结束



  // ————————————liuxiaobin end———————————— 






});
