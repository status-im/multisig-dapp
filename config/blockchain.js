module.exports = {
  default: {
    enabled: true,
    rpcHost: "localhost", 
    rpcPort: 8745, 
    rpcCorsDomain: {
      auto: true,
      additionalCors: []
    },
    wsRPC: true,
    wsOrigins: { 
      auto: true,
      additionalCors: []
    },
    wsHost: "localhost",
    wsPort: 8746 
  },

  development: {
    ethereumClientName: "geth", 
    networkType: "custom", 
    networkId: 1337,
    isDev: true,
    datadir: ".embark/development/datadir",
    mineWhenNeeded: true, 
    nodiscover: true, 
    maxpeers: 0, 
    proxy: true, 
    targetGasLimit: 8000000, 
    simulatorBlocktime: 0
  },

  testnet: {
    networkType: "testnet",
    syncMode: "light",
    accounts: [
      {
        nodeAccounts: true,
        password: "config/testnet/.password"
      }
    ]
  },

  livenet: {
    networkType: "livenet",
    syncMode: "light",
    accounts: [
      {
        nodeAccounts: true,
        password: "config/livenet/.password"
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
        password: "config/rinkeby/.password"
      }
    ],
  }
 
};
