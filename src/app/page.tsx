"use client"

import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import {
  http,
  Address,
  Hash,
  TransactionReceipt,
  createPublicClient,
  createWalletClient,
  custom,
  stringify,
  Chain,
  EIP1193RequestFn,
  TransportConfig,
} from 'viem'
import { goerli, mainnet } from 'viem/chains'
import 'viem/window'
import { wagmiContract } from './contracts/contract'

const publicClient = createPublicClient({
  chain: goerli,
  transport: http(),
})

const walletClient = createWalletClient({
  chain: goerli,
  transport: custom(window.ethereum!),
})

export default function Home() {
  const [account, setAccount] = useState<Address>()
  const [hash, setHash] = useState<Hash>()
  const [receipt, setReceipt] = useState<TransactionReceipt>()

  const connect = async () => {
    const [address] = await walletClient.requestAddresses()
    setAccount(address)
  }

  const mint = async () => {
    if (!account) return
    const { request } = await publicClient.simulateContract({
      account,
      address: "0xd9145CCE52D386f254917e481eB44e9943F39138",
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
      functionName: "store",
      args: [BigInt(2)],
      gas: BigInt(69420), 
    })
    const hash = await walletClient.writeContract(request)
    setHash(hash)
    console.log({ hash })
  }

  useEffect(() =>{
    connect()
  }, [])

  if (account)
    return (
      <>
        <div>Connected: {account}</div>
        <button onClick={mint}>Mint</button>
        {receipt && (
          <>
            <div>
              Receipt:{' '}
              <pre>
                <code>{stringify(receipt, null, 2)}</code>
              </pre>
            </div>
          </>
        )}
      </>
    )
  return <button>Connect Wallet</button>
}
