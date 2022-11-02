const { deployContract, contractAt , sendTxn } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toUsd } = require("../../test/shared/units")
const { errors } = require("../../test/core/Vault/helpers")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];

async function main() {
  const { nativeToken } = tokens

  //const vault = await deployContract("Vault", [])
  const vault = await contractAt("Vault", "0x93B77c4e537Cbe1b579eb48b06BFa35D015a306e")
  //const usdg = await deployContract("USDG", [vault.address])
  const usdg = await contractAt("USDG", "0x67f10C810f9F7912251801926708a3f083AaB806")
  //const router = await deployContract("Router", [vault.address, usdg.address, nativeToken.address])
  const router = await contractAt("Router", "0x7112C86F1c11eb406094abb84CeC151E0F138D76")
  const vaultPriceFeed = await contractAt("VaultPriceFeed", "0xBCDfDEde71213A88CCd08f0D68C286eCd11a1617")
  // const secondaryPriceFeed = await deployContract("FastPriceFeed", [5 * 60])

  //const vaultPriceFeed = await deployContract("VaultPriceFeed", [])

  // await vaultPriceFeed.setMaxStrictPriceDeviation(expandDecimals(1, 28))// 0.05 USD
  // await vaultPriceFeed.setPriceSampleSpace(1)
  // await vaultPriceFeed.setIsAmmEnabled(false)

  // //const glp = await deployContract("GLP", [])
  // await glp.setInPrivateTransferMode(true)
  // // const glp = await contractAt("GLP", "0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258")
  // const shortsTracker = await deployContract("ShortsTracker", [vault.address])
  // const glpManager = await deployContract("GlpManager", [vault.address, usdg.address, glp.address, shortsTracker.address, 15 * 60])

  // await glpManager.setInPrivateMode(true)

  // await glp.setMinter(glpManager.address, true)
  // await usdg.addVault(glpManager.address)

  // await vault.initialize(
  //   router.address, // router
  //   usdg.address, // usdg
  //   vaultPriceFeed.address, // priceFeed
  //   toUsd(2), // liquidationFeeUsd
  //   100, // fundingRateFactor
  //   100 // stableFundingRateFactor
  // )

  // await vault.setFundingRate(60 * 60, 100, 100)

  // await vault.setInManagerMode(true)
  // await vault.setManager(glpManager.address, true)

  // await vault.setFees(
  //   10, // _taxBasisPoints
  //   5, // _stableTaxBasisPoints
  //   20, // _mintBurnFeeBasisPoints
  //   20, // _swapFeeBasisPoints
  //   1, // _stableSwapFeeBasisPoints
  //   10, // _marginFeeBasisPoints
  //   toUsd(2), // _liquidationFeeUsd
  //   24 * 60 * 60, // _minProfitTime
  //   true // _hasDynamicFees
  // )

  const vaultErrorController = await contractAt("VaultErrorController", "0xA165Cd33A76B0d7F980808Fd86E4ea22a5a99eF9")
  await vault.setErrorController(vaultErrorController.address)
  await vaultErrorController.setErrors(vault.address, errors)

  const vaultUtils = await deployContract("VaultUtils", [vault.address])
  await vault.setVaultUtils(vaultUtils.address)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
