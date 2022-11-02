const { getFrameSigner, deployContract, contractAt , sendTxn } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toUsd } = require("../../test/shared/units")
const { errors } = require("../../test/core/Vault/helpers")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];

const depositFee = 30 // 0.3%


async function getAvaxValues() {
  const vault = await contractAt("Vault", "0x93B77c4e537Cbe1b579eb48b06BFa35D015a306e")
  const timelock = await contractAt("Timelock", await vault.gov())
  const router = await contractAt("Router", await vault.router())
  const shortsTracker = await contractAt("ShortsTracker", "0xc6b94636E4a73010095FFeA0e38e2ee4bccaa022")
  const weth = await contractAt("WETH", tokens.nativeToken.address)
  const orderBook = await contractAt("OrderBook", "0x1a5866E805082C9B5d63274bF114F70C6f0F1312")
  const referralStorage = await contractAt("ReferralStorage", "0x6F445A54B6D9528b2B3A0976BEa0D87101cA6e2c")

  const orderKeepers = [
    { address: "0x76CB1D77697cB76884524DE784bb23a351323369" },
  ]
  const liquidators = [
    { address: "0x76CB1D77697cB76884524DE784bb23a351323369" }
  ]

  const partnerContracts = []

  return { vault, timelock, router, shortsTracker, weth, depositFee, orderBook, referralStorage, orderKeepers, liquidators, partnerContracts }
}

async function getValues() {


  if (network === "avax") {
    return getAvaxValues()
  }
}

async function main() {
  

  const {
    positionManagerAddress,
    vault,
    timelock,
    router,
    shortsTracker,
    weth,
    depositFee,
    orderBook,
    referralStorage,
    orderKeepers,
    liquidators,
    partnerContracts
  } = await getValues()

  let positionManager
  // if (positionManagerAddress) {
  //   console.log("Using position manager at", positionManagerAddress)
  //   positionManager = await contractAt("PositionManager", positionManagerAddress)
  // } else {
  //   console.log("Deploying new position manager")
  //   const positionManagerArgs = [vault.address, router.address, shortsTracker.address, weth.address, depositFee, orderBook.address]
  //   positionManager = await deployContract("PositionManager", positionManagerArgs)
  // }
  positionManager = await contractAt("PositionManager", "0x0ffAa3e57BDfd0B3e4F2CEE7Bbe90C0A0b74a88a")
  // positionManager only reads from referralStorage so it does not need to be set as a handler of referralStorage
  if ((await positionManager.referralStorage()).toLowerCase() != referralStorage.address.toLowerCase()) {
    await positionManager.setReferralStorage(referralStorage.address)
  }
  if (await positionManager.shouldValidateIncreaseOrder()) {
    await positionManager.setShouldValidateIncreaseOrder(false)
  }

  for (let i = 0; i < orderKeepers.length; i++) {
    const orderKeeper = orderKeepers[i]
    if (!(await positionManager.isOrderKeeper(orderKeeper.address))) {
      await positionManager.setOrderKeeper(orderKeeper.address, true)
    }
  }

  for (let i = 0; i < liquidators.length; i++) {
    const liquidator = liquidators[i]
    if (!(await positionManager.isLiquidator(liquidator.address))) {
      await positionManager.setLiquidator(liquidator.address, true)
    }
  }

  // if (!(await timelock.isHandler(positionManager.address))) {
  //   await timelock.setContractHandler(positionManager.address, true), "timelock.setContractHandler(positionRouter)")
  // }
  // if (!(await vault.isLiquidator(positionManager.address))) {
  //   await timelock.setLiquidator(vault.address, positionManager.address, true), "timelock.setLiquidator(vault, positionManager, true)")
  // }
  if (!(await shortsTracker.isHandler(positionManager.address))) {
    await shortsTracker.setHandler(positionManager.address, true)
  }
  if (!(await router.plugins(positionManager.address))) {
    await router.addPlugin(positionManager.address)
  }

  for (let i = 0; i < partnerContracts.length; i++) {
    const partnerContract = partnerContracts[i]
    if (!(await positionManager.isPartner(partnerContract))) {
      await positionManager.setPartner(partnerContract, false)
    }
  }

  // if ((await positionManager.gov()) != (await vault.gov())) {
  //   await positionManager.setGov(await vault.gov())
  // }

  console.log("done.")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
