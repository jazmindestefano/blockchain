"use client";

import React, { useEffect, useState } from "react";
import {
  http,
  Address,
  Hash,
  TransactionReceipt,
  createPublicClient,
  createWalletClient,
  custom,
  stringify,
  zeroAddress,
} from "viem";
import { sepolia } from "viem/chains";
import "viem/window";
import { storeContract } from "./contracts/contract";

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum!),
});

export default function Home() {
  const [wallet, setWallet] = useState<Address>();
  const [hash, setHash] = useState<Hash>();
  const [retrievedValue, setRetrievedValue] = useState<BigInt>();
  const [storeValue, setStoreValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    console.log("address before connect: ", wallet);
    const [address] = await walletClient.requestAddresses();
    setWallet(address);
    console.log("address after connect: ", address);
  };

  const disconnect = () => {
    setWallet(undefined);
    setHash(undefined);
    setRetrievedValue(undefined);
    setStoreValue("");
    console.log("address after disconnect: ", wallet);
  };

  const store = async () => {
    if (!wallet) return;

    if (!storeValue.trim()) {
      setError("Please provide a value for storing.");
      return;
    }

    try {
      console.log("Validating transaction...");
      const { request } = await publicClient.simulateContract({
        ...storeContract,
        account: wallet,
        functionName: "store",
        args: [BigInt(storeValue)],
      });
      console.log("Sending transaction...");
      const hash = await walletClient.writeContract(request);
      setHash(hash);
      console.log({ hash });
    } catch (error) {
      setTimeout(() => setError("Failed to store value."), 5000);
    }
  };

  const retrieve = async () => {
    if (!wallet) return;

    try {
      console.log("Reading contract...");
      const retrieved = await publicClient.readContract({
        ...storeContract,
        account: wallet,
        functionName: "retrieve",
      });
      setRetrievedValue(retrieved);
      console.log({ retrievedValue });
    } catch (error) {
      setTimeout(() => setError("Failed to retrieve value."), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
      {wallet ? (
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-black text-3xl font-bold mb-6">
            Connected Account: {wallet}
          </h3>
          <div className="flex gap-6 items-center justify-center">
            <input
              type="text"
              value={storeValue}
              onChange={(e) => setStoreValue(e.target.value)}
              placeholder="Enter value"
              className="bg-white text-purple-500 px-4 py-2 rounded mt-4"
            />
            <button
              className="bg-white text-purple-500 px-4 py-2 rounded mt-4"
              onClick={store}
            >
              Store
            </button>
            <button
              className="bg-white text-purple-500 px-4 py-2 rounded mt-4"
              onClick={retrieve}
            >
              Retrieve
            </button>
          </div>
          {retrievedValue && (
            <div className="text-white flex flex-col items-center justify-center mt-4">
              <div className="bg-gradient-to-br from-purple-500 to-blue-500 text-white px-4 py-2 rounded">
                Retrieved value: <span>{stringify(retrievedValue)}</span>
              </div>
            </div>
          )}
          {hash && (
            <div className="text-white flex flex-col items-center justify-center mt-4">
              <div className="bg-gradient-to-br from-purple-500 to-blue-500 text-white px-4 py-2 rounded">
                Transaction Hash: <span>{hash}</span>
              </div>
            </div>
          )}
          {error && <div className="text-black mt-4">{error}</div>}
          <button
            className="bg-white text-purple-500 px-4 py-2 mt-4 rounded"
            onClick={disconnect}
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <button
          className="bg-white text-purple-500 px-4 py-2 rounded"
          onClick={connect}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
