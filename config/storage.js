module.exports = {
  default: {
    enabled: true,
    ipfs_bin: "ipfs",
    available_providers: ["ipfs"],
    upload: {
      provider: "ipfs",
      host: "localhost",
      port: 5001
    }
  }
};