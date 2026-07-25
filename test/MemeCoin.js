const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MemeCoin", function () {
  it("mints the full supply to the deployer", async function () {
    const [owner] = await ethers.getSigners();
    const MemeCoin = await ethers.getContractFactory("MemeCoin");
    const memeCoin = await MemeCoin.deploy();

    const totalSupply = await memeCoin.totalSupply();
    const ownerBalance = await memeCoin.balanceOf(owner.address);

    expect(await memeCoin.name()).to.equal("Verity");
    expect(await memeCoin.symbol()).to.equal("VRT");
    expect(ownerBalance).to.equal(totalSupply);
  });
});
