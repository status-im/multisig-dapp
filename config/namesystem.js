module.exports = {
  default: {
    enabled: true,
    available_providers: ["ens"],
    provider: "ens"
  },
  development: {
    register: {
      rootDomain: "eth",
      subdomains: {
        'embark': '0x1a2f3b98e434c02363f3dac3174af93c1d690914'
      }
    }
  },
  testnet: {
  },

  livenet: {
  },

  rinkeby: {
  }
};