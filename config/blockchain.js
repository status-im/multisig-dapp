module.exports = {
  default: {
    enabled: true,
    client: "geth",
    syncMode: "light",
    nodiscover: false,
    maxpeers: 25
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
    networkType: "livenet",
    accounts: [
      {
        nodeAccounts: true,
        password: ".password"
      }
    ]
  },

  rinkeby: {
    networkType: "rinkeby",
    accounts: [
      {
        nodeAccounts: true,
        password: ".password"
      }
    ],
  }
};
