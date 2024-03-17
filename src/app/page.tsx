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
} from 'viem'
import { sepolia } from 'viem/chains'
import 'viem/window'
import { storeContract } from './contracts/contract'

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
})

const walletClient = createWalletClient({
  chain: sepolia,
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
    console.log("Validating transaction...");
    const { request } = await publicClient.simulateContract({
      ...storeContract,
      account,
      functionName: "store",
      args: [BigInt(2)],
    })
    console.log("Sending transaction...");
    const hash = await walletClient.writeContract(request)
    setHash(hash)
    console.log({ hash })
  }

  return (
    <div className="min-h-screen bg-purple-500 flex items-center justify-center">
      {account ? (
        <div className='flex flex-col items-center justify-center'>
          <div className="text-white">
            Connected: {account}
          </div>
          <button className="bg-white text-purple-500 px-4 py-2 rounded mt-4" onClick={mint}>
            Mint
          </button>
          {receipt && (
            <div className="text-white mt-4">
              Receipt:{' '}
              <pre>
                <code>{stringify(receipt)}</code>
              </pre>
            </div>
          )}
           {hash && (
            <div className="text-white flex flex-col items-center justify-center mt-4">
              Transaction Hash:{' '}
              <pre>
                <code>{stringify(hash)}</code>
              </pre>
            </div>
          )}
        </div>
      ) : (
        <button className="bg-white text-purple-500 px-4 py-2 rounded" onClick={connect}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}
