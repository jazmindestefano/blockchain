// Wagmi Contract Bytecode.
// https://etherscan.io/address/0xfba3912ca04dd458c843e2ee08967fc04f3579c2#code

export const storeContract = {
  address: "0x457a861f31b5885d9cd731d1c5f548ad546324a3",
  abi: [
    {
      "inputs": [],
      "name": "retrieve",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "num",
          "type": "uint256"
        }
      ],
      "name": "store",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
} as const