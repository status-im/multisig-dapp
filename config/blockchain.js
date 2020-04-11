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
      networkType: "livenet",
      syncMode: "light",
      accounts: [
        {
          nodeAccounts: true,
          password: ".password"
        },
        {
          mnemonic: process.env.DAPP_MNEMONIC
        }
      ]
    },

  rinkeby: {
    enabled: true,
    networkType: "rinkeby",
    syncMode: "light",
    rpcHost: "localhost",
    rpcPort: 8745,
    accounts: [
      {
        nodeAccounts: true,
        password: ".password"
      }
    ],
  },
  travis: {
    networkType: "livenet",
    syncMode: "light",
    accounts: [
      {
        nodeAccounts: true,
        password: ".password"
      }
    ]
  },
};
