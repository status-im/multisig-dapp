module.exports = {
  default: {
    enabled: true,
    available_providers: ["swarm"],
    upload: {
      provider: "swarm",
      host: "localhost",
      port: 8500
    },
    dappConnection: [
      "$BZZ",
      {
        provider:"swarm",
        host: "localhost",
        port: 8500,
        getUrl: "http://localhost:8500/bzzr:/"
      }
    ]
  },
  development: {
  },

  testnet: {
  },

  livenet: {
  },

  rinkeby: {
  }
};