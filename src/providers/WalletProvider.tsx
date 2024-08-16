"use client"
import React, { useState, useEffect } from 'react';
import { Wallet, NearContext } from '@/wallet/WalletSelector';
import { constants } from '@/constants';

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet>();
  const [signedAccountId, setSignedAccountId] = useState<string>('');

  useEffect(() => {
    const walletInstance = new Wallet({ networkId: constants.network, createAccessKeyFor: 'test.testnet' });
    walletInstance.startUp(setSignedAccountId);
    setWallet(walletInstance);
  }, []);

  return (
    <NearContext.Provider value={{ wallet, signedAccountId }}>
      {children}
    </NearContext.Provider>
  );
};
