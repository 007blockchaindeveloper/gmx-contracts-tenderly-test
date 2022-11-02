const { getFrameSigner, deployContract, contractAt , sendTxn } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toUsd } = require("../../test/shared/units")
const { errors } = require("../../test/core/Vault/helpers")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];

async function main() {
  const vault = await contractAt("Vault", "0x93B77c4e537Cbe1b579eb48b06BFa35D015a306e")
  const timelock = await contractAt("Timelock", await vault.gov())
  const vaultUtils = await deployContract("VaultUtils", [vault.address])
//  await timelock.setVaultUtils(vault.address, vaultUtils.address)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
