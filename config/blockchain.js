module.exports = {
  default: {
    enabled: true,
    client: "geth"
  },

  development: {
    client: 'ganache-cli',
    clientConfig: {
      miningMode: 'dev'
    }
  },

  testnet: {
    networkType: "testnet",
    syncMode: "light",
    accounts: [
      {
        nodeAccounts: true,
        password: ".password"
      }
    ]
  },

  livenet: {
    endpoint: "ws://localhost:8546",
    networkType: "livenet",
    syncMode: "light",
    proxy: false,
    nodiscover: false,
    maxpeers: 25,
    accounts: [
      {
        mnemonic: process.env.DAPP_MNEMONIC
      },
      {
        nodeAccounts: true,
        password: ".password"
      }
    ]
  },

  rinkeby: {
    networkType: "rinkeby",
    syncMode: "light",
    accounts: [
      {
        nodeAccounts: true,
        password: ".password"
      }
    ],
  }
};
