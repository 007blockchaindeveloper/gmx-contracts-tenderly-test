const { getFrameSigner, deployContract, contractAt , sendTxn, readTmpAddresses, writeTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toUsd } = require("../../test/shared/units")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];

async function getAvaxValues() {
  const vault = await contractAt("Vault", "0x93B77c4e537Cbe1b579eb48b06BFa35D015a306e")
  const timelock = await contractAt("Timelock", await vault.gov())
  const router = await contractAt("Router", await vault.router())
  const weth = await contractAt("WETH", tokens.nativeToken.address)
  const referralStorage = await contractAt("ReferralStorage", "0x6F445A54B6D9528b2B3A0976BEa0D87101cA6e2c")
  const shortsTracker = await contractAt("ShortsTracker", "0xc6b94636E4a73010095FFeA0e38e2ee4bccaa022")
  const depositFee = "30" // 0.3%
  const minExecutionFee = "20000000000000000" // 0.02 AVAX

  return {
    vault,
    timelock,
    router,
    weth,
    referralStorage,
    shortsTracker,
    depositFee,
    minExecutionFee
  }
}

async function getValues() {
  if (network === "avax") {
    return getAvaxValues()
  }
}

async function main() {
  const {
    vault,
    timelock,
    router,
    weth,
    shortsTracker,
    depositFee,
    minExecutionFee,
    referralStorage
  } = await getValues()

  //const referralStorageGov = await contractAt("Timelock", await referralStorage.gov())

  const positionRouterArgs = [vault.address, router.address, weth.address, shortsTracker.address, depositFee, minExecutionFee]
  const positionRouter = await deployContract("PositionRouter", positionRouterArgs)

  await positionRouter.setReferralStorage(referralStorage.address)
 // await referralStorageGov.signalSetHandler(referralStorage.address, positionRouter.address, true)

  await shortsTracker.setHandler(positionRouter.address, true)

  await router.addPlugin(positionRouter.address)

  await positionRouter.setDelayValues(1, 180, 30 * 60)
 // await timelock.setContractHandler(positionRouter.address, true)

  //await positionRouter.setGov(await vault.gov())
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
