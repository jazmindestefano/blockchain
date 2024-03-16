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
  return <button onClick={connect}>Connect Wallet</button>
}
