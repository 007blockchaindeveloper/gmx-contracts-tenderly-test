const { getFrameSigner, deployContract, contractAt, sendTxn, readTmpAddresses, callWithRetries } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toChainlinkPrice } = require("../../test/shared/chainlink")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];

async function main() {
  const vault = await contractAt("Vault", "0x93B77c4e537Cbe1b579eb48b06BFa35D015a306e")

  const priceFeed = await contractAt("VaultPriceFeed", await vault.priceFeed())
  const priceFeedGov = await priceFeed.gov()
  //const priceFeedTimelock = await contractAt("Timelock", priceFeedGov)
  const priceFeedTimelock = await contractAt("PriceFeedTimelock", "0xb1Bbbf03d307AAFc7a7773F20eeb8354Ea82Fab5")

  const priceFeedMethod = "signalPriceFeedSetTokenConfig"
  // const priceFeedMethod = "priceFeedSetTokenConfig"

  console.log("vault", vault.address)
  console.log("priceFeed", priceFeed.address)
  console.log("priceFeedTimelock", priceFeedTimelock.address)
  console.log("priceFeedMethod", priceFeedMethod)

  const { avax } = tokens
  const tokenArr = [avax]

  for (const token of tokenArr) {
    await priceFeedTimelock.signalPriceFeedSetTokenConfig(
      priceFeed.address, // _vaultPriceFeed
      token.address, // _token
      token.priceFeed, // _priceFeed
      token.priceDecimals, // _priceDecimals
      token.isStrictStable // _isStrictStable
    )
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
