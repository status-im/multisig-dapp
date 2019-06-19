module.exports = {
  default: {
    deployment: {
      host: "localhost", 
      port: 8746,
      type: "ws"
    },
    dappConnection: [
      "$WEB3", 
      "ws://localhost:8746",
      "http://localhost:8745"
    ],
    gas: "auto",
    strategy: "explicit",
    contracts: {  
    }
  },
  travis: {
    deployment: {
      accounts: [
        {
          mnemonic: process.env.DAPP_MNEMONIC 
        }
      ]
    }
  }
}
