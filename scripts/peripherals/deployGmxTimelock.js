const { deployContract, contractAt, sendTxn } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');

const { AddressZero } = ethers.constants

async function runForAvax() {
  const admin = "0x76CB1D77697cB76884524DE784bb23a351323369"
  const rewardManager = { address: ethers.constants.AddressZero }
  const buffer = 5
  const longBuffer = 7
  const tokenManager = { address: "0xa7BDE6fCCe12C31000a5735e7D103824C2EC645d" }
  const mintReceiver = { address: AddressZero }
  const maxTokenSupply = expandDecimals("13250000", 18)

  const timelock = await deployContract("GmxTimelock", [
    admin,
    buffer,
    longBuffer,
    rewardManager.address,
    tokenManager.address,
    mintReceiver.address,
    maxTokenSupply
  ])
}

async function main() {
  if (network === "avax") {
    await runForAvax()
    return
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
