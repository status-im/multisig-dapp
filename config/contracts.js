module.exports = {
  default: {
    library: 'embarkjs',
    dappConnection: [
      "$EMBARK",
      "$WEB3",
      "ws://localhost:8546",
      "http://localhost:8545"
    ],
    gas: "auto",
    strategy: "explicit",
    dappAutoEnable: true
  },
  livenet: {
    dappConnection: [
      "$WEB3"
    ]
  }
}