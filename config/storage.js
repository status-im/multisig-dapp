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
      },
      {
        provider:"swarm",
        host: "swarm-gateways.net",
        port: 80,
        getUrl: "http://swarm-gateways.net/bzzr:/"
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