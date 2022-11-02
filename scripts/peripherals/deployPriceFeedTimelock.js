const { deployContract, contractAt,  getFrameSigner } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');

async function getAvaxValues() {
  const tokenManager = { address: "0xa7BDE6fCCe12C31000a5735e7D103824C2EC645d" }

  return { tokenManager }
}

async function getValues() {
  if (network === "avax") {
    return getAvaxValues()
  }
}

async function main() {

  const admin = "0x76CB1D77697cB76884524DE784bb23a351323369"
  const buffer = 5

  const { tokenManager } = await getValues()

  const timelock = await deployContract("PriceFeedTimelock", [
    admin,
    buffer,
    tokenManager.address
  ], "Timelock")

  const deployedTimelock = await contractAt("PriceFeedTimelock", timelock.address)

  const signers = [
    "0x76CB1D77697cB76884524DE784bb23a351323369", // dmytro
  ]

  for (let i = 0; i < signers.length; i++) {
    const signer = signers[i]
    await deployedTimelock.setContractHandler(signer, true)
  }

  const keepers = [
    "0x76CB1D77697cB76884524DE784bb23a351323369" // X
  ]

  for (let i = 0; i < keepers.length; i++) {
    const keeper = keepers[i]
    await deployedTimelock.setKeeper(keeper, true)
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
