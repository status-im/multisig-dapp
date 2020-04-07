module.exports = {
  default: {
    enabled: false,
    provider: "whisper", 
    available_providers: ["whisper"],
    client: "geth",
    connection: {
      host: "localhost", 
      port: 8546,
      type: "ws" 
    }
  }
};
