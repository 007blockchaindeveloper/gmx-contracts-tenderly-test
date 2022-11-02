const { deployContract, contractAt, sendTxn, getFrameSigner } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');


async function getAvaxValues() {
  const vault = await contractAt("Vault", "0x93B77c4e537Cbe1b579eb48b06BFa35D015a306e")
  const tokenManager = { address: "0xa7BDE6fCCe12C31000a5735e7D103824C2EC645d" }
  const glpManager = { address: "0x6bB8b28daB08e79f507B85873127D38145B3ddf3" }

  const positionRouter = { address: "0x743607b29C8A237Fb7837bC2A16230D542eF1279" }
  const positionManager = { address: "0x0ffAa3e57BDfd0B3e4F2CEE7Bbe90C0A0b74a88a" }
  const gmx = { address: "0x2452A37c96c5a69E98cfCE69F1Cc6AFF0429EAf5" }

  return { vault, tokenManager, glpManager, positionRouter, positionManager, gmx }
}

async function getValues() {

  if (network === "avax") {
    return getAvaxValues()
  }
}

async function main() {

  const admin = "0x76CB1D77697cB76884524DE784bb23a351323369"
  const buffer = 5
  const maxTokenSupply = expandDecimals("13250000", 18)

  const { vault, tokenManager, glpManager, positionRouter, positionManager, gmx } = await getValues()
  const mintReceiver = tokenManager

  // const timelock = await deployContract("Timelock", [
  //   admin,
  //   buffer,
  //   tokenManager.address,
  //   mintReceiver.address,
  //   glpManager.address,
  //   maxTokenSupply,
  //   10, // marginFeeBasisPoints 0.1%
  //   500 // maxMarginFeeBasisPoints 5%
  // ], "Timelock")

  const deployedTimelock = await contractAt("Timelock", "0xc3b5666e296fd27f32a29b21951A204578329ec5")

  await deployedTimelock.setShouldToggleIsLeverageEnabled(true)
  console.log("1")
  await deployedTimelock.setContractHandler(positionRouter.address, true)
  console.log("2")
  await deployedTimelock.setContractHandler(positionManager.address, true)
  console.log("3")
  // // update gov of vault
  const vaultGov = await contractAt("Timelock", await vault.gov())

  // await vaultGov.signalSetGov(vault.address, deployedTimelock.address), "vaultGov.signalSetGov")
  // await deployedTimelock.signalSetGov(vault.address, vaultGov.address), "deployedTimelock.signalSetGov(vault)")

  const signers = [
    "0x76CB1D77697cB76884524DE784bb23a351323369", // dmytro
  ]

  for (let i = 0; i < signers.length; i++) {
    const signer = signers[i]
    await deployedTimelock.setContractHandler(signer, true)
  }
  console.log("4")
  const keepers = [
    "0x76CB1D77697cB76884524DE784bb23a351323369" // dmytro
  ]

  for (let i = 0; i < keepers.length; i++) {
    const keeper = keepers[i]
    await deployedTimelock.setKeeper(keeper, true)
  }
  console.log("5")
  await deployedTimelock.signalApprove(gmx.address, admin, "1000000000000000000")
  console.log("6")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
