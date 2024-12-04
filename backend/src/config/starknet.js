module.exports = {
  network: process.env.STARKNET_NETWORK || 'testnet',
  contractAddress: process.env.CONTRACT_ADDRESS,
  providerUrl: process.env.STARKNET_PROVIDER_URL,
  // Add other Starknet-specific configurations
}; 