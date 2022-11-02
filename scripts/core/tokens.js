// price feeds https://docs.chain.link/docs/binance-smart-chain-addresses/
const { expandDecimals } = require("../../test/shared/utilities")

module.exports = {
  avax: {
    avax: {
      name: "avax",
      address: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",//"0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      decimals: 18,
      priceFeed: "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD",//"0x0A77230d17318075983913bC2145DB16C7366156",
      priceDecimals: 8,
      fastPricePrecision: 1000,
      maxCumulativeDeltaDiff: 0.01 * 10 * 1000 * 1000, // 1%
      isStrictStable: false,
      tokenWeight: 8000,
      minProfitBps: 0,
      maxUsdgAmount: 8 * 1000 *1000,
      bufferAmount: 300000,
      isStable: false,
      isShortable: true,
      maxGlobalLongSize: 2 * 1000 * 1000,
      maxGlobalShortSize: 1 * 1000 * 1000,
      spreadBasisPoints: 10
    },
    eth: {
      name: "eth",
      address: "0x4f5003fd2234Df46FB2eE1531C89b8bdcc372255",
      decimals: 18,
      priceFeed: "0x86d67c3D38D2bCeE722E601025C25a575021c6EA",//"0x976B3D034E162d8bD72D6b9C989d545b839003b0",
      priceDecimals: 8,
      fastPricePrecision: 1000,
      maxCumulativeDeltaDiff: 0.02 * 10 * 1000 * 1000, // 2%
      isStrictStable: false,
      tokenWeight: 20000,
      minProfitBps: 0,
      maxUsdgAmount: 30 * 1000 * 1000,
      bufferAmount: 5500,
      isStable: false,
      isShortable: true,
      maxGlobalShortSize: 5 * 1000 * 1000
    },
    btc: {
      name: "btc",
      address: "0x385104afA0BfdAc5A2BcE2E3fae97e96D1CB9160",
      decimals: 8,
      priceFeed: "0x31CF013A08c6Ac228C94551d535d5BAfE19c602a",//"0x2779D32d5166BAaa2B2b658333bA7e6Ec0C65743",
      priceDecimals: 8,
      fastPricePrecision: 1000,
      maxCumulativeDeltaDiff: 0.02 * 10 * 1000 * 1000, // 2%
      isStrictStable: false,
      tokenWeight: 10000,
      minProfitBps: 0,
      maxUsdgAmount: 30 * 1000 * 1000,
      bufferAmount: 200,
      isStable: false,
      isShortable: true,
      maxGlobalShortSize: 2 * 1000 * 1000
    },
    btcb: {
      name: "btcb",
      address: "0x385104afA0BfdAc5A2BcE2E3fae97e96D1CB9160",
      decimals: 8,
      priceFeed: "0x31CF013A08c6Ac228C94551d535d5BAfE19c602a",//"0x2779D32d5166BAaa2B2b658333bA7e6Ec0C65743",
      priceDecimals: 8,
      fastPricePrecision: 1000,
      maxCumulativeDeltaDiff: 0.02 * 10 * 1000 * 1000, // 2%
      isStrictStable: false,
      tokenWeight: 12000,
      minProfitBps: 0,
      maxUsdgAmount: 30 * 1000 * 1000,
      bufferAmount: 100,
      isStable: false,
      isShortable: true,
      maxGlobalShortSize: 5 * 1000 * 1000
    },
    usdc: {
      name: "USDC",
      address: "0x45ea5d57ba80b5e3b0ed502e9a08d568c96278f9",//"0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
      decimals: 6,
      priceFeed: "0x7898AcCC83587C3C55116c5230C17a6Cd9C71bad",
      priceDecimals: 8,
      isStrictStable: true,
      tokenWeight: 30000,
      minProfitBps: 0,
      maxUsdgAmount: 50 * 1000 * 1000,
      bufferAmount: 17 * 1000 * 1000,
      isStable: true,
      isShortable: false
    },
    nativeToken: {
      name: "wavax",
      address: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
      decimals: 18
    }
    // mim: {
    //   name: "mim",
    //   address: "0x130966628846BFd36ff31a822705796e8cb8C18D",
    //   decimals: 18,
    //   priceFeed: "0x54EdAB30a7134A16a54218AE64C73e1DAf48a8Fb",
    //   priceDecimals: 8,
    //   isStrictStable: true,
    //   tokenWeight: 1,
    //   minProfitBps: 0,
    //   maxUsdgAmount: 1,
    //   bufferAmount: 0,
    //   isStable: true,
    //   isShortable: false
    // },
    // usdce: {
    //   name: "usdce",
    //   address: "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
    //   decimals: 6,
    //   priceFeed: "0xF096872672F44d6EBA71458D74fe67F9a77a23B9",
    //   priceDecimals: 8,
    //   isStrictStable: true,
    //   tokenWeight: 20000,
    //   minProfitBps: 0,
    //   maxUsdgAmount: 70 * 1000 * 1000,
    //   bufferAmount: 13 * 1000 * 1000,
    //   isStable: true,
    //   isShortable: false
    // },
    
  }
}
