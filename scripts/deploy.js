async function main() {
  const MemeCoin = await ethers.getContractFactory("MemeCoin");
  const memeCoin = await MemeCoin.deploy();

  await memeCoin.waitForDeployment();

  console.log("MemeCoin deployed to:", await memeCoin.getAddress());
  console.log("Name:", await memeCoin.name());
  console.log("Symbol:", await memeCoin.symbol());
  console.log("Total supply:", (await memeCoin.totalSupply()).toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
